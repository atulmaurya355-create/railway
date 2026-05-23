import { ApiError } from '../../utils/apiError.js';
import { Question } from '../questions/question.model.js';
import { MockTestAttempt } from './mockTestAttempt.model.js';
import { processMockTestGamification } from '../leaderboard/leaderboard.service.js';
import { createNotification } from '../notifications/notification.service.js';

const defaultConfig = {
  fullLength: {
    title: 'Railway Full Length Mock Test',
    questionCount: 100,
    durationMinutes: 90,
  },
  sectional: {
    title: 'Railway Sectional Mock Test',
    questionCount: 25,
    durationMinutes: 25,
  },
};

export function getMockTestConfig() {
  return {
    testTypes: [
      {
        id: 'fullLength',
        title: 'Full Length Test',
        description: 'Exam-style random questions across railway categories.',
        defaultQuestionCount: defaultConfig.fullLength.questionCount,
        defaultDurationMinutes: defaultConfig.fullLength.durationMinutes,
      },
      {
        id: 'sectional',
        title: 'Sectional Test',
        description: 'Focused random questions by category or topic.',
        defaultQuestionCount: defaultConfig.sectional.questionCount,
        defaultDurationMinutes: defaultConfig.sectional.durationMinutes,
      },
    ],
    categories: ['RRB NTPC', 'Group D', 'ALP & Technician', 'Railway JE', 'General Railway'],
    topics: ['Mathematics', 'Reasoning', 'General Awareness', 'General Science', 'Current Affairs'],
  };
}

export async function startMockTest(userId, payload) {
  const config = defaultConfig[payload.testType];
  const questionCount = payload.questionCount ?? config.questionCount;
  const durationMinutes = payload.durationMinutes ?? config.durationMinutes;
  const query = { isActive: true };

  if (payload.testType === 'sectional') {
    if (payload.category) query.category = payload.category;
    if (payload.topic) query.topic = payload.topic;
  } else if (payload.category) {
    query.category = payload.category;
  }

  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: questionCount } },
    {
      $project: {
        question: 1,
        options: 1,
        correctAnswer: 1,
        difficulty: 1,
        topic: 1,
        category: 1,
        explanation: 1,
      },
    },
  ]);

  if (questions.length === 0) {
    throw new ApiError(400, 'No active questions found for this mock test selection');
  }

  const attempt = await MockTestAttempt.create({
    user: userId,
    title: buildTitle(payload),
    testType: payload.testType,
    category: payload.category ?? 'All Railway Exams',
    topic: payload.topic ?? '',
    durationSeconds: durationMinutes * 60,
    totalQuestions: questions.length,
    questions: questions.map((question) => ({
      questionId: question._id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      topic: question.topic,
      category: question.category,
      explanation: question.explanation,
    })),
  });

  return sanitizeAttempt(attempt);
}

export async function getAttemptForUser(attemptId, userId) {
  const attempt = await MockTestAttempt.findOne({ _id: attemptId, user: userId });

  if (!attempt) {
    throw new ApiError(404, 'Mock test attempt not found');
  }

  return attempt.status === 'inProgress' ? sanitizeAttempt(attempt) : buildResult(attempt, await getRank(attempt));
}

export async function submitMockTest(attemptId, userId, payload) {
  const attempt = await MockTestAttempt.findOne({ _id: attemptId, user: userId });

  if (!attempt) {
    throw new ApiError(404, 'Mock test attempt not found');
  }

  if (attempt.status !== 'inProgress') {
    return buildResult(attempt, await getRank(attempt));
  }

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let skippedAnswers = 0;

  attempt.questions = attempt.questions.map((question) => {
    const selectedAnswer = payload.answers[question.questionId.toString()] ?? null;
    const isSkipped = selectedAnswer === null;
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isSkipped) skippedAnswers += 1;
    else if (isCorrect) correctAnswers += 1;
    else wrongAnswers += 1;

    question.selectedAnswer = selectedAnswer;
    question.isSkipped = isSkipped;
    question.isCorrect = isCorrect;
    return question;
  });

  const attemptedQuestions = attempt.totalQuestions - skippedAnswers;
  attempt.correctAnswers = correctAnswers;
  attempt.wrongAnswers = wrongAnswers;
  attempt.skippedAnswers = skippedAnswers;
  attempt.score = correctAnswers;
  attempt.accuracy = attemptedQuestions ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0;
  attempt.timeTakenSeconds = Math.min(payload.timeTakenSeconds, attempt.durationSeconds);
  attempt.status = payload.isAutoSubmitted ? 'autoSubmitted' : 'submitted';
  attempt.submittedAt = new Date();
  await attempt.save();

  let gamificationSummary = null;
  try {
    gamificationSummary = await processMockTestGamification(userId, attempt);
    if (gamificationSummary && gamificationSummary.newBadges && gamificationSummary.newBadges.length > 0) {
      for (const badgeName of gamificationSummary.newBadges) {
        let title = 'Achievement Unlocked! 🏆';
        let message = `Congratulations! You earned the "${badgeName}" badge!`;
        if (badgeName === 'First Quiz') {
          message = `Congratulations! You completed your first quiz and earned the "First Quiz" badge! 🏆`;
        } else if (badgeName === '10 Quizzes') {
          message = `Incredible consistency! You completed 10 quizzes and unlocked the "10 Quizzes" badge! 🎯`;
          title = 'Milestone Reached! 🎯';
        } else if (badgeName === '100 Questions Solved') {
          message = `Brilliant! You solved 100 questions correctly and unlocked the "100 Questions Solved" badge! ⚡`;
          title = 'Slayer Unlocked! ⚡';
        } else if (badgeName === 'Top Scorer') {
          message = `Excellent performance! You scored 90%+ in a full length test and earned the "Top Scorer" badge! 🌟`;
          title = 'Elite Performer! 🌟';
        }
        
        await createNotification(userId, {
          title,
          message,
          type: 'achievement',
          metadata: { badgeName }
        });
      }
    }
  } catch (error) {
    console.error('Error processing gamification:', error);
  }

  const result = buildResult(attempt, await getRank(attempt));
  return {
    ...result,
    gamificationSummary,
  };
}

export async function getAttemptRank(attemptId, userId) {
  const attempt = await MockTestAttempt.findOne({ _id: attemptId, user: userId });

  if (!attempt) {
    throw new ApiError(404, 'Mock test attempt not found');
  }

  return getRank(attempt);
}

export async function getLeaderboard(filters) {
  const query = { status: { $in: ['submitted', 'autoSubmitted'] } };

  if (filters.testType) query.testType = filters.testType;
  if (filters.category) query.category = filters.category;
  if (filters.topic) query.topic = filters.topic;

  const attempts = await MockTestAttempt.find(query)
    .populate('user', 'name email')
    .sort({ score: -1, accuracy: -1, timeTakenSeconds: 1, submittedAt: 1 })
    .limit(filters.limit);

  return attempts.map((attempt, index) => ({
    rank: index + 1,
    attemptId: attempt.id,
    student: attempt.user?.name ?? 'Student',
    score: attempt.score,
    accuracy: attempt.accuracy,
    timeTakenSeconds: attempt.timeTakenSeconds,
    submittedAt: attempt.submittedAt,
  }));
}

async function getRank(attempt) {
  if (attempt.status === 'inProgress') {
    return null;
  }

  const query = {
    status: { $in: ['submitted', 'autoSubmitted'] },
    testType: attempt.testType,
    category: attempt.category,
    topic: attempt.topic,
    $or: [
      { score: { $gt: attempt.score } },
      { score: attempt.score, accuracy: { $gt: attempt.accuracy } },
      {
        score: attempt.score,
        accuracy: attempt.accuracy,
        timeTakenSeconds: { $lt: attempt.timeTakenSeconds },
      },
    ],
  };

  const betterAttempts = await MockTestAttempt.countDocuments(query);
  const totalParticipants = await MockTestAttempt.countDocuments({
    status: { $in: ['submitted', 'autoSubmitted'] },
    testType: attempt.testType,
    category: attempt.category,
    topic: attempt.topic,
  });

  return {
    currentRank: betterAttempts + 1,
    totalParticipants,
  };
}

function sanitizeAttempt(attempt) {
  return {
    attemptId: attempt.id,
    title: attempt.title,
    testType: attempt.testType,
    category: attempt.category,
    topic: attempt.topic,
    durationSeconds: attempt.durationSeconds,
    totalQuestions: attempt.totalQuestions,
    questions: attempt.questions.map((question) => ({
      id: question.questionId?.toString(),
      question: question.question,
      options: question.options,
      difficulty: question.difficulty,
      topic: question.topic,
      category: question.category,
    })),
  };
}

function buildResult(attempt, rank) {
  return {
    attemptId: attempt.id,
    title: attempt.title,
    testType: attempt.testType,
    category: attempt.category,
    topic: attempt.topic,
    status: attempt.status,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    accuracy: attempt.accuracy,
    correctAnswers: attempt.correctAnswers,
    wrongAnswers: attempt.wrongAnswers,
    skippedAnswers: attempt.skippedAnswers,
    timeTakenSeconds: attempt.timeTakenSeconds,
    rank,
    details: attempt.questions.map((question) => ({
      questionId: question.questionId?.toString(),
      question: question.question,
      options: question.options,
      selectedAnswer: question.selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: question.isCorrect,
      isSkipped: question.isSkipped,
      explanation: question.explanation,
      topic: question.topic,
      category: question.category,
      difficulty: question.difficulty,
    })),
  };
}

function buildTitle(payload) {
  if (payload.testType === 'fullLength') {
    return payload.category ? `${payload.category} Full Length Mock Test` : 'Railway Full Length Mock Test';
  }

  return payload.topic
    ? `${payload.topic} Sectional Mock Test`
    : `${payload.category ?? 'Railway'} Sectional Mock Test`;
}

export async function getAttemptsHistory(userId) {
  return await MockTestAttempt.find({
    user: userId,
    status: { $in: ['submitted', 'autoSubmitted'] },
  }).sort({ submittedAt: -1 });
}

