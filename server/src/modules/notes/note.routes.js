import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  createNoteHandler,
  getNotesHandler,
  getNoteByIdHandler,
  updateNoteHandler,
  deleteNoteHandler,
} from './note.controller.js';

export const noteRoutes = Router();

// Apply auth middleware to protect notes CRUD
noteRoutes.use(authenticate);

noteRoutes.route('/')
  .post(createNoteHandler)
  .get(getNotesHandler);

noteRoutes.route('/:noteId')
  .get(getNoteByIdHandler)
  .put(updateNoteHandler)
  .delete(deleteNoteHandler);
