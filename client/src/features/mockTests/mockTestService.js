import { httpClient } from '../../services/httpClient.js';

const fallbackQuestions = [
  {
    id: 'local-1',
    question: 'A train covers 360 km in 4 hours. What is its speed?',
    options: { A: '80 km/h', B: '90 km/h', C: '100 km/h', D: '120 km/h' },
    correctAnswer: 'B',
    explanation: 'Speed = distance / time = 360 / 4 = 90 km/h.',
    topic: 'Mathematics',
    category: 'RRB NTPC',
    difficulty: 'easy',
  },
  {
    id: 'local-2',
    question: 'Which article of the Indian Constitution deals with equality before law?',
    options: { A: 'Article 12', B: 'Article 14', C: 'Article 19', D: 'Article 21' },
    correctAnswer: 'B',
    explanation: 'Article 14 provides equality before law and equal protection of laws.',
    topic: 'General Awareness',
    category: 'RRB NTPC',
    difficulty: 'medium',
  },
  {
    id: 'local-3',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: { A: '40', B: '42', C: '44', D: '46' },
    correctAnswer: 'B',
    explanation: 'The differences are 4, 6, 8, 10, so the next difference is 12. Answer = 42.',
    topic: 'Reasoning',
    category: 'Group D',
    difficulty: 'medium',
  },
  {
    id: 'local-4',
    question: 'Which instrument is used to measure atmospheric pressure?',
    options: { A: 'Thermometer', B: 'Ammeter', C: 'Barometer', D: 'Voltmeter' },
    correctAnswer: 'C',
    explanation: 'A barometer is used to measure atmospheric pressure.',
    topic: 'General Science',
    category: 'Group D',
    difficulty: 'easy',
  },
  {
    id: 'local-5',
    question: 'If 15% of a number is 45, then the number is:',
    options: { A: '250', B: '275', C: '300', D: '350' },
    correctAnswer: 'C',
    explanation: 'Number = 45 x 100 / 15 = 300.',
    topic: 'Mathematics',
    category: 'Railway JE',
    difficulty: 'easy',
  },
];

export const mockTestService = {
  async getConfig() {
    try {
      const response = await httpClient.get('/mock-tests/config');
      return response.data.data;
    } catch (_error) {
      return {
        testTypes: [
          {
            id: 'fullLength',
            title: 'Full Length Test',
            description: 'Exam-style random questions across railway categories.',
            defaultQuestionCount: 5,
            defaultDurationMinutes: 10,
          },
          {
            id: 'sectional',
            title: 'Sectional Test',
            description: 'Focused random questions by category or topic.',
            defaultQuestionCount: 5,
            defaultDurationMinutes: 8,
          },
        ],
        categories: ['RRB NTPC', 'Group D', 'ALP & Technician', 'Railway JE'],
        topics: ['Mathematics', 'Reasoning', 'General Awareness', 'General Science'],
      };
    }
  },

  async startTest(payload) {
    try {
      const response = await httpClient.post('/mock-tests/start', payload);
      return response.data.data.attempt;
    } catch (_error) {
      const questions = selectFallbackQuestions(payload);
      return {
        attemptId: `local-${Date.now()}`,
        title:
          payload.testType === 'fullLength'
            ? 'Railway Full Length Mock Test'
            : `${payload.topic || payload.category || 'Railway'} Sectional Mock Test`,
        testType: payload.testType,
        category: payload.category || 'All Railway Exams',
        topic: payload.topic || '',
        durationSeconds: (payload.durationMinutes || 10) * 60,
        totalQuestions: questions.length,
        questions,
        isLocal: true,
      };
    }
  },

  async submitTest(attempt, payload) {
    if (!attempt.isLocal) {
      const response = await httpClient.post(`/mock-tests/${attempt.attemptId}/submit`, payload);
      return response.data.data.result;
    }

    return calculateLocalResult(attempt, payload);
  },

  async getLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/mock-tests/leaderboard', { params });
      return response.data.data.leaderboard;
    } catch (_error) {
      return [
        { rank: 1, student: 'Priya Sharma', score: 5, accuracy: 100, timeTakenSeconds: 410 },
        { rank: 2, student: 'Ankit Kumar', score: 4, accuracy: 80, timeTakenSeconds: 455 },
        { rank: 3, student: 'You', score: 0, accuracy: 0, timeTakenSeconds: 0 },
      ];
    }
  },
};

function selectFallbackQuestions(payload) {
  const filtered = fallbackQuestions.filter((question) => {
    if (payload.testType !== 'sectional') return true;
    if (payload.topic) return question.topic === payload.topic;
    if (payload.category) return question.category === payload.category;
    return true;
  });

  return (filtered.length ? filtered : fallbackQuestions).slice(0, payload.questionCount || 5);
}

function calculateLocalResult(attempt, payload) {
  const details = attempt.questions.map((question) => {
    const selectedAnswer = payload.answers[question.id] || null;
    const isSkipped = selectedAnswer === null;
    const isCorrect = selectedAnswer === question.correctAnswer;

    return {
      questionId: question.id,
      question: question.question,
      options: question.options,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      topic: question.topic,
      category: question.category,
      difficulty: question.difficulty,
      isSkipped,
      isCorrect,
    };
  });
  const correctAnswers = details.filter((item) => item.isCorrect).length;
  const skippedAnswers = details.filter((item) => item.isSkipped).length;
  const wrongAnswers = details.length - correctAnswers - skippedAnswers;
  const attempted = details.length - skippedAnswers;

  return {
    attemptId: attempt.attemptId,
    title: attempt.title,
    testType: attempt.testType,
    category: attempt.category,
    topic: attempt.topic,
    status: payload.isAutoSubmitted ? 'autoSubmitted' : 'submitted',
    score: correctAnswers,
    totalQuestions: details.length,
    accuracy: attempted ? Math.round((correctAnswers / attempted) * 100) : 0,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    timeTakenSeconds: payload.timeTakenSeconds,
    rank: {
      currentRank: Math.max(1, 12 - correctAnswers),
      totalParticipants: 124,
    },
    details,
  };
}
