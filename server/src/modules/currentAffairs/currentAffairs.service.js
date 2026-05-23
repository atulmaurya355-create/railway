import { ApiError } from '../../utils/apiError.js';
import { CurrentAffairs } from './currentAffairs.model.js';
import { CurrentAffairsQuiz } from './currentAffairsQuiz.model.js';
import { CurrentAffairsQuizAttempt } from './currentAffairsQuizAttempt.model.js';

// ============ Current Affairs Services ============

export async function createCurrentAffairs(payload, userId) {
  const affairs = await CurrentAffairs.create({
    ...payload,
    createdBy: userId,
    date: new Date(payload.date),
  });

  return affairs;
}

export async function listCurrentAffairs(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;
  const query = { isPublished: true };

  if (filters.affairsType) query.affairsType = filters.affairsType;
  if (filters.category) query.category = filters.category;

  let sortOption = { date: -1 };
  if (filters.sort === 'mostViewed') sortOption = { views: -1, date: -1 };
  if (filters.sort === 'oldest') sortOption = { date: 1 };

  const [affairs, total] = await Promise.all([
    CurrentAffairs.find(query)
      .select('-content')
      .populate('createdBy', 'name avatarUrl')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    CurrentAffairs.countDocuments(query),
  ]);

  return {
    affairs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCurrentAffairsById(affairsId) {
  const affairs = await CurrentAffairs.findByIdAndUpdate(
    affairsId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('createdBy', 'name avatarUrl');

  if (!affairs) {
    throw new ApiError(404, 'Current affairs not found');
  }

  return affairs;
}

export async function updateCurrentAffairs(affairsId, payload, userId) {
  const affairs = await CurrentAffairs.findById(affairsId);

  if (!affairs) {
    throw new ApiError(404, 'Current affairs not found');
  }

  // Check authorization (admin or creator)
  if (affairs.createdBy.toString() !== userId && !isAdmin(userId)) {
    throw new ApiError(403, 'Not authorized to update this content');
  }

  Object.assign(affairs, payload);
  if (payload.date) affairs.date = new Date(payload.date);

  await affairs.save();
  return affairs;
}

export async function deleteCurrentAffairs(affairsId, userId) {
  const affairs = await CurrentAffairs.findById(affairsId);

  if (!affairs) {
    throw new ApiError(404, 'Current affairs not found');
  }

  // Check authorization
  if (affairs.createdBy.toString() !== userId && !isAdmin(userId)) {
    throw new ApiError(403, 'Not authorized to delete this content');
  }

  await CurrentAffairs.deleteOne({ _id: affairsId });
  return { message: 'Current affairs deleted successfully' };
}

export async function searchCurrentAffairs(query, filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const searchQuery = {
    isPublished: true,
    $or: [
      { title: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { content: new RegExp(query, 'i') },
      { keyPoints: new RegExp(query, 'i') },
    ],
  };

  if (filters.affairsType) searchQuery.affairsType = filters.affairsType;
  if (filters.category) searchQuery.category = filters.category;

  const [affairs, total] = await Promise.all([
    CurrentAffairs.find(searchQuery)
      .select('-content')
      .populate('createdBy', 'name avatarUrl')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    CurrentAffairs.countDocuments(searchQuery),
  ]);

  return {
    affairs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ============ Current Affairs Quiz Services ============

export async function createCurrentAffairsQuiz(payload, userId) {
  const quiz = await CurrentAffairsQuiz.create({
    ...payload,
    createdBy: userId,
  });

  return quiz;
}

export async function listCurrentAffairsQuizzes(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;
  const query = { isPublished: true };

  if (filters.quizType) query.quizType = filters.quizType;

  const [quizzes, total] = await Promise.all([
    CurrentAffairsQuiz.find(query)
      .select('-questions')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CurrentAffairsQuiz.countDocuments(query),
  ]);

  return {
    quizzes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCurrentAffairsQuizById(quizId) {
  const quiz = await CurrentAffairsQuiz.findById(quizId)
    .populate('createdBy', 'name')
    .populate('relatedAffairs', 'title description');

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  return quiz;
}

export async function updateCurrentAffairsQuiz(quizId, payload, userId) {
  const quiz = await CurrentAffairsQuiz.findById(quizId);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  Object.assign(quiz, payload);
  await quiz.save();

  return quiz;
}

export async function deleteCurrentAffairsQuiz(quizId, userId) {
  const quiz = await CurrentAffairsQuiz.findById(quizId);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  await CurrentAffairsQuiz.deleteOne({ _id: quizId });
  return { message: 'Quiz deleted successfully' };
}

export async function submitCurrentAffairsQuiz(quizId, answers, userId, duration) {
  const quiz = await CurrentAffairsQuiz.findById(quizId);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  let totalMarksObtained = 0;
  let correctAnswers = 0;
  const processedAnswers = [];

  quiz.questions.forEach((question, index) => {
    const userAnswer = answers.find((a) => a.questionIndex === index);
    let isCorrect = false;
    let marksObtained = 0;

    if (userAnswer) {
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      const userSelectedCorrect = userAnswer.selectedOptions.every((selected) =>
        correctOptions.some((opt) => opt.text === selected)
      );
      const userDidntSelectIncorrect = userAnswer.selectedOptions.every((selected) =>
        question.options.some((opt) => opt.text === selected && opt.isCorrect)
      );

      isCorrect = userSelectedCorrect && userDidntSelectIncorrect;

      if (isCorrect) {
        marksObtained = question.marks || 1;
        correctAnswers += 1;
      }
    }

    totalMarksObtained += marksObtained;
    processedAnswers.push({
      questionIndex: index,
      selectedOptions: userAnswer?.selectedOptions || [],
      isCorrect,
      marksObtained,
    });
  });

  const percentage = (totalMarksObtained / quiz.totalMarks) * 100;
  const isPassed = percentage >= quiz.passingScore;

  const attempt = await CurrentAffairsQuizAttempt.create({
    quizId,
    userId,
    answers: processedAnswers,
    totalMarksObtained,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    incorrectAnswers: quiz.questions.length - correctAnswers - (processedAnswers.filter((a) => !a.isCorrect && a.selectedOptions.length === 0).length),
    unattempted: processedAnswers.filter((a) => a.selectedOptions.length === 0).length,
    percentage,
    isPassed,
    duration,
    startedAt: new Date(Date.now() - duration * 1000),
    submittedAt: new Date(),
  });

  // Update quiz attempts count
  quiz.attempts += 1;
  await quiz.save();

  return {
    attempt,
    result: {
      totalMarksObtained,
      totalMarks: quiz.totalMarks,
      percentage: percentage.toFixed(2),
      isPassed,
      correctAnswers,
      incorrectAnswers: quiz.questions.length - correctAnswers - processedAnswers.filter((a) => a.selectedOptions.length === 0).length,
      unattempted: processedAnswers.filter((a) => a.selectedOptions.length === 0).length,
    },
  };
}

export async function getUserQuizHistory(userId, filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const query = { userId };

  if (filters.quizType) {
    const quizzes = await CurrentAffairsQuiz.find({ quizType: filters.quizType }, '_id');
    query.quizId = { $in: quizzes.map((q) => q._id) };
  }

  const [attempts, total] = await Promise.all([
    CurrentAffairsQuizAttempt.find(query)
      .populate('quizId', 'title quizType')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit),
    CurrentAffairsQuizAttempt.countDocuments(query),
  ]);

  return {
    attempts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCurrentAffairsQuizAttemptById(attemptId) {
  const attempt = await CurrentAffairsQuizAttempt.findById(attemptId)
    .populate('quizId')
    .populate('userId', 'name email');

  if (!attempt) {
    throw new ApiError(404, 'Quiz attempt not found');
  }

  return attempt;
}

// Helper function (would need to be implemented with actual role checking)
function isAdmin(userId) {
  // This would check against user role in actual implementation
  return true; // For now, assuming admin can authorize
}
