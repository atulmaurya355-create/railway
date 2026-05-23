import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getRecommendations,
  getWeakTopics,
  createWeakTopicSprint,
  getRevisionPlanner,
  updateRevisionConfidence,
} from './recommendation.service.js';

export const getRecommendationsHandler = asyncHandler(async (req, res) => {
  const recommendations = await getRecommendations(req.user.id);

  res.status(200).json({
    success: true,
    data: { recommendations },
  });
});

export const getWeakTopicsHandler = asyncHandler(async (req, res) => {
  const weakTopics = await getWeakTopics(req.user.id);

  res.status(200).json({
    success: true,
    data: { weakTopics },
  });
});

export const createWeakTopicSprintHandler = asyncHandler(async (req, res) => {
  const sprint = await createWeakTopicSprint(req.user.id, req.params.topicName);

  res.status(200).json({
    success: true,
    data: { sprint },
  });
});

export const getRevisionPlannerHandler = asyncHandler(async (req, res) => {
  const revisionSchedules = await getRevisionPlanner(req.user.id);

  res.status(200).json({
    success: true,
    data: { revisionSchedules },
  });
});

export const updateRevisionConfidenceHandler = asyncHandler(async (req, res) => {
  const result = await updateRevisionConfidence(req.user.id, req.params.scheduleId, req.body);

  res.status(200).json({
    success: true,
    message: 'Spaced repetition schedule updated',
    data: result,
  });
});
