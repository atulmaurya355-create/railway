import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  listQuestions,
  updateQuestion,
} from './question.service.js';

export const createQuestionHandler = asyncHandler(async (req, res) => {
  const question = await createQuestion(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: { question },
  });
});

export const listQuestionsHandler = asyncHandler(async (req, res) => {
  const data = await listQuestions(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getQuestionHandler = asyncHandler(async (req, res) => {
  const question = await getQuestionById(req.params.id);

  res.status(200).json({
    success: true,
    data: { question },
  });
});

export const updateQuestionHandler = asyncHandler(async (req, res) => {
  const question = await updateQuestion(req.params.id, req.body, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Question updated successfully',
    data: { question },
  });
});

export const deleteQuestionHandler = asyncHandler(async (req, res) => {
  await deleteQuestion(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
  });
});
