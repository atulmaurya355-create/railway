import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getActiveStudyPlan,
  generateStudyPlan,
  addStudyTask,
  toggleStudyTask,
} from './studyPlan.service.js';

export const getActiveStudyPlanHandler = asyncHandler(async (req, res) => {
  const result = await getActiveStudyPlan(req.user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const generateStudyPlanHandler = asyncHandler(async (req, res) => {
  const result = await generateStudyPlan(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'AI Study Plan generated successfully',
    data: result,
  });
});

export const addStudyTaskHandler = asyncHandler(async (req, res) => {
  const task = await addStudyTask(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Study task added successfully',
    data: { task },
  });
});

export const toggleStudyTaskHandler = asyncHandler(async (req, res) => {
  const task = await toggleStudyTask(req.params.taskId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Study task updated successfully',
    data: { task },
  });
});
