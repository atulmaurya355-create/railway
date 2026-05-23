import { asyncHandler } from '../../utils/asyncHandler.js';
import { getQuiz, submitQuiz } from './quiz.service.js';

export const getActiveQuiz = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      quiz: getQuiz(),
    },
  });
});

export const submitActiveQuiz = asyncHandler(async (req, res) => {
  const result = submitQuiz(req.body);

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      result,
    },
  });
});
