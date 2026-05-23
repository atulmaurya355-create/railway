import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  createBookmarkHandler,
  getBookmarksHandler,
  updateBookmarkHandler,
  deleteBookmarkHandler,
  getBookmarkPracticeQuestionsHandler,
} from './bookmark.controller.js';

export const bookmarkRoutes = Router();

// Secure all bookmark actions under user auth
bookmarkRoutes.use(authenticate);

bookmarkRoutes.route('/')
  .post(createBookmarkHandler)
  .get(getBookmarksHandler);

bookmarkRoutes.get('/practice', getBookmarkPracticeQuestionsHandler);

bookmarkRoutes.route('/:bookmarkId')
  .put(updateBookmarkHandler)
  .delete(deleteBookmarkHandler);
