import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createBookmark,
  getBookmarks,
  updateBookmark,
  deleteBookmark,
  getBookmarkPracticeQuestions,
} from './bookmark.service.js';

export const createBookmarkHandler = asyncHandler(async (req, res) => {
  const bookmark = await createBookmark(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Bookmark added successfully',
    data: { bookmark },
  });
});

export const getBookmarksHandler = asyncHandler(async (req, res) => {
  const data = await getBookmarks(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const updateBookmarkHandler = asyncHandler(async (req, res) => {
  const bookmark = await updateBookmark(req.params.bookmarkId, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Bookmark updated successfully',
    data: { bookmark },
  });
});

export const deleteBookmarkHandler = asyncHandler(async (req, res) => {
  const result = await deleteBookmark(req.params.bookmarkId, req.user.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getBookmarkPracticeQuestionsHandler = asyncHandler(async (req, res) => {
  const questions = await getBookmarkPracticeQuestions(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data: { questions },
  });
});
