import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  askTutor,
  deleteTutorSession,
  getTutorSession,
  listTutorSessions,
} from './aiTutor.service.js';

export const askTutorHandler = asyncHandler(async (req, res) => {
  const data = await askTutor(req.user, req.body);

  res.status(200).json({
    success: true,
    message: 'AI tutor response generated',
    data,
  });
});

export const listTutorSessionsHandler = asyncHandler(async (req, res) => {
  const sessions = await listTutorSessions(req.user.id);

  res.status(200).json({
    success: true,
    data: { sessions },
  });
});

export const getTutorSessionHandler = asyncHandler(async (req, res) => {
  const session = await getTutorSession(req.params.sessionId, req.user.id);

  res.status(200).json({
    success: true,
    data: { session },
  });
});

export const deleteTutorSessionHandler = asyncHandler(async (req, res) => {
  await deleteTutorSession(req.params.sessionId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'AI tutor chat deleted',
  });
});
