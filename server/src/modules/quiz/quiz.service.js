import { sampleQuiz } from './quiz.data.js';

export function getQuiz() {
  return {
    ...sampleQuiz,
    questions: sampleQuiz.questions.map(({ correctOptionIndex, explanation, ...question }) => question),
  };
}

export function submitQuiz({ answers, skippedQuestionIds, bookmarkedQuestionIds, timeTakenSeconds }) {
  const details = sampleQuiz.questions.map((question) => {
    const selectedOptionIndex = answers[question.id];
    const isSkipped = skippedQuestionIds.includes(question.id) || selectedOptionIndex === undefined;
    const isCorrect = !isSkipped && selectedOptionIndex === question.correctOptionIndex;

    return {
      questionId: question.id,
      subject: question.subject,
      question: question.question,
      options: question.options,
      selectedOptionIndex: selectedOptionIndex ?? null,
      correctOptionIndex: question.correctOptionIndex,
      isCorrect,
      isSkipped,
      isBookmarked: bookmarkedQuestionIds.includes(question.id),
      explanation: question.explanation,
    };
  });

  const totalQuestions = sampleQuiz.questions.length;
  const correctAnswers = details.filter((item) => item.isCorrect).length;
  const skippedAnswers = details.filter((item) => item.isSkipped).length;
  const wrongAnswers = totalQuestions - correctAnswers - skippedAnswers;
  const attemptedQuestions = totalQuestions - skippedAnswers;
  const accuracy = attemptedQuestions ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0;

  return {
    quizId: sampleQuiz.id,
    title: sampleQuiz.title,
    score: correctAnswers,
    totalQuestions,
    accuracy,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    timeTakenSeconds,
    details,
  };
}
