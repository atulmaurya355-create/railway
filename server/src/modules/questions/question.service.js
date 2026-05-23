import { ApiError } from '../../utils/apiError.js';
import { Question } from './question.model.js';
import { mapQuestionPayload } from './question.mapper.js';
import { createNotification } from '../notifications/notification.service.js';

export async function createQuestion(payload, userId) {
  const question = await Question.create({
    ...mapQuestionPayload(payload),
    createdBy: userId,
    updatedBy: userId,
  });

  try {
    await createNotification(userId, {
      title: 'New Sectional Practice Updated! 📝',
      message: `A new question has been added to ${payload.category || 'All Exams'} - ${payload.topic || 'All Topics'}. Try it out in your sectional practice now!`,
      type: 'newQuiz',
      metadata: { category: payload.category, topic: payload.topic }
    });
  } catch (err) {
    console.error('Error creating newQuiz notification:', err);
  }

  return question;
}

export async function listQuestions(filters) {
  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - 1) * limit;
  const query = {};

  if (!filters.includeInactive) {
    query.isActive = true;
  }

  if (filters.topic) {
    query.topic = new RegExp(escapeRegex(filters.topic), 'i');
  }

  if (filters.category) {
    query.category = new RegExp(escapeRegex(filters.category), 'i');
  }

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.search) {
    query.$or = [
      { question: new RegExp(escapeRegex(filters.search), 'i') },
      { topic: new RegExp(escapeRegex(filters.search), 'i') },
      { category: new RegExp(escapeRegex(filters.search), 'i') },
      { explanation: new RegExp(escapeRegex(filters.search), 'i') },
    ];
  }

  const [questions, total] = await Promise.all([
    Question.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Question.countDocuments(query),
  ]);

  return {
    questions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getQuestionById(questionId) {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  return question;
}

export async function updateQuestion(questionId, payload, userId) {
  const update = mapQuestionPayload(payload);

  if (update.options) {
    const currentQuestion = await getQuestionById(questionId);
    update.options = {
      ...currentQuestion.options.toObject(),
      ...update.options,
    };
  }

  const question = await Question.findByIdAndUpdate(
    questionId,
    {
      ...update,
      updatedBy: userId,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  return question;
}

export async function deleteQuestion(questionId) {
  const question = await Question.findByIdAndDelete(questionId);

  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  return question;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
