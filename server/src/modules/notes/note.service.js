import { Note } from './note.model.js';
import { ApiError } from '../../utils/apiError.js';

export async function createNote(userId, payload) {
  const { title, content, category, tags, isPinned, isAutoSaved } = payload;

  const note = await Note.create({
    user: userId,
    title: title || 'Untitled Note',
    content: content || '',
    category: category || 'GK',
    tags: tags || [],
    isPinned: isPinned || false,
    isAutoSaved: isAutoSaved || false,
  });

  return note;
}

export async function getNotes(userId, queryOptions = {}) {
  const { category, search, pinnedOnly, page = 1, limit = 30 } = queryOptions;

  const filter = { user: userId };

  if (category) {
    filter.category = category;
  }

  if (pinnedOnly) {
    filter.isPinned = true;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const notes = await Note.find(filter)
    .sort({ isPinned: -1, updatedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Note.countDocuments(filter);

  return {
    notes,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function getNoteById(noteId, userId) {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }
  return note;
}

export async function updateNote(noteId, userId, payload) {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  const { title, content, category, tags, isPinned, isAutoSaved } = payload;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;
  if (tags !== undefined) note.tags = tags;
  if (isPinned !== undefined) note.isPinned = isPinned;
  if (isAutoSaved !== undefined) note.isAutoSaved = isAutoSaved;

  await note.save();
  return note;
}

export async function deleteNote(noteId, userId) {
  const result = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!result) {
    throw new ApiError(404, 'Note not found');
  }
  return { message: 'Note deleted successfully' };
}
