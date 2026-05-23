import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from './note.service.js';

export const createNoteHandler = asyncHandler(async (req, res) => {
  const note = await createNote(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: { note },
  });
});

export const getNotesHandler = asyncHandler(async (req, res) => {
  const data = await getNotes(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getNoteByIdHandler = asyncHandler(async (req, res) => {
  const note = await getNoteById(req.params.noteId, req.user.id);

  res.status(200).json({
    success: true,
    data: { note },
  });
});

export const updateNoteHandler = asyncHandler(async (req, res) => {
  const note = await updateNote(req.params.noteId, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: { note },
  });
});

export const deleteNoteHandler = asyncHandler(async (req, res) => {
  const result = await deleteNote(req.params.noteId, req.user.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
