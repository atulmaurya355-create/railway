import { Bookmark } from './bookmark.model.js';
import { ApiError } from '../../utils/apiError.js';

export async function createBookmark(userId, payload) {
  const { itemType, referenceId, title, subject, difficulty, personalNote, details } = payload;

  if (!itemType || !referenceId || !title) {
    throw new ApiError(400, 'itemType, referenceId, and title are required fields');
  }

  // Check if already bookmarked
  const existing = await Bookmark.findOne({ user: userId, itemType, referenceId });
  if (existing) {
    return existing;
  }

  const bookmark = await Bookmark.create({
    user: userId,
    itemType,
    referenceId,
    title,
    subject: subject || 'General',
    difficulty: difficulty || 'General',
    personalNote: personalNote || '',
    details: details || {},
  });

  return bookmark;
}

export async function getBookmarks(userId, queryOptions = {}) {
  const { itemType, subject, difficulty, search, page = 1, limit = 30 } = queryOptions;

  const filter = { user: userId };

  if (itemType) {
    filter.itemType = itemType;
  }

  if (subject) {
    filter.subject = subject;
  }

  if (difficulty && difficulty !== 'All') {
    filter.difficulty = difficulty;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { personalNote: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const bookmarks = await Bookmark.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Bookmark.countDocuments(filter);

  return {
    bookmarks,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function updateBookmark(bookmarkId, userId, payload) {
  const bookmark = await Bookmark.findOne({ _id: bookmarkId, user: userId });
  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found');
  }

  const { personalNote, difficulty, subject } = payload;

  if (personalNote !== undefined) bookmark.personalNote = personalNote;
  if (difficulty !== undefined) bookmark.difficulty = difficulty;
  if (subject !== undefined) bookmark.subject = subject;

  await bookmark.save();
  return bookmark;
}

export async function deleteBookmark(bookmarkId, userId) {
  const result = await Bookmark.findOneAndDelete({ _id: bookmarkId, user: userId });
  if (!result) {
    throw new ApiError(404, 'Bookmark not found');
  }
  return { message: 'Bookmark removed successfully' };
}

export async function getBookmarkPracticeQuestions(userId, query = {}) {
  // Gathers bookmarked questions (QuizQuestion, WrongQuestion, MockQuestion) for practice
  const filter = {
    user: userId,
    itemType: { $in: ['QuizQuestion', 'WrongQuestion', 'MockQuestion'] },
  };

  if (query.subject) {
    filter.subject = query.subject;
  }

  const bookmarks = await Bookmark.find(filter).limit(20);
  
  // Transform bookmarks into general MCQ format for the client CBT Practice Engine
  return bookmarks.map((b, idx) => ({
    id: b.referenceId,
    questionText: b.title,
    subject: b.subject,
    difficulty: b.difficulty,
    options: b.details?.options || ['Option A', 'Option B', 'Option C', 'Option D'],
    correctOption: b.details?.correctOption || 'A',
    explanation: b.details?.explanation || 'Explanation not saved.',
    personalNote: b.personalNote,
  }));
}
