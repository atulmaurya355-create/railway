import { httpClient } from '../../services/httpClient.js';

export const fallbackQuiz = {
  id: 'railway-ntpc-mini-mock-01',
  title: 'RRB NTPC Mini Mock Test',
  durationSeconds: 10 * 60,
  questions: [
    {
      id: 'q1',
      subject: 'Reasoning',
      question: 'If TRAIN is coded as USBJO, then how is RAIL coded?',
      options: ['SBJM', 'SBHK', 'QZHK', 'TBJM'],
    },
    {
      id: 'q2',
      subject: 'Mathematics',
      question: 'A train running at 72 km/h crosses a pole in 15 seconds. What is the length of the train?',
      options: ['250 m', '275 m', '300 m', '320 m'],
    },
    {
      id: 'q3',
      subject: 'General Awareness',
      question: 'The headquarters of Indian Railways is located in which city?',
      options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
    },
    {
      id: 'q4',
      subject: 'General Science',
      question: 'Which gas is primarily responsible for the greenhouse effect?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    },
    {
      id: 'q5',
      subject: 'Mathematics',
      question: 'The average of 12, 18, 24, and 30 is:',
      options: ['20', '21', '22', '24'],
    },
  ],
};

const fallbackAnswers = {
  q1: { correctOptionIndex: 0, explanation: 'Each letter is shifted one position forward.' },
  q2: { correctOptionIndex: 2, explanation: '72 km/h = 20 m/s. Length = 20 x 15 = 300 m.' },
  q3: { correctOptionIndex: 1, explanation: 'Indian Railways is headquartered at Rail Bhavan in New Delhi.' },
  q4: { correctOptionIndex: 2, explanation: 'Carbon dioxide is a major greenhouse gas.' },
  q5: { correctOptionIndex: 1, explanation: 'Average = 84 / 4 = 21.' },
};

export const quizService = {
  async getActiveQuiz() {
    try {
      const response = await httpClient.get('/quiz/active');
      return response.data.data.quiz;
    } catch (_error) {
      return fallbackQuiz;
    }
  },

  async submitQuiz(payload) {
    try {
      const response = await httpClient.post('/quiz/submit', payload);
      return response.data.data.result;
    } catch (_error) {
      return calculateFallbackResult(payload);
    }
  },
};

function calculateFallbackResult({ answers, skippedQuestionIds, bookmarkedQuestionIds, timeTakenSeconds }) {
  const details = fallbackQuiz.questions.map((question) => {
    const selectedOptionIndex = answers[question.id];
    const answer = fallbackAnswers[question.id];
    const isSkipped = skippedQuestionIds.includes(question.id) || selectedOptionIndex === undefined;
    const isCorrect = !isSkipped && selectedOptionIndex === answer.correctOptionIndex;

    return {
      ...question,
      questionId: question.id,
      selectedOptionIndex: selectedOptionIndex ?? null,
      correctOptionIndex: answer.correctOptionIndex,
      explanation: answer.explanation,
      isSkipped,
      isCorrect,
      isBookmarked: bookmarkedQuestionIds.includes(question.id),
    };
  });
  const totalQuestions = fallbackQuiz.questions.length;
  const correctAnswers = details.filter((item) => item.isCorrect).length;
  const skippedAnswers = details.filter((item) => item.isSkipped).length;
  const wrongAnswers = totalQuestions - correctAnswers - skippedAnswers;
  const attemptedQuestions = totalQuestions - skippedAnswers;

  return {
    quizId: fallbackQuiz.id,
    title: fallbackQuiz.title,
    score: correctAnswers,
    totalQuestions,
    accuracy: attemptedQuestions ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    timeTakenSeconds,
    details,
  };
}
