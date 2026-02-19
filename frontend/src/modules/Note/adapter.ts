import type { NoteDto, NoteProps } from './types';

export const noteAdapter = (el: NoteDto): NoteProps => ({
  noteId: el.id,
  author: el.author || '',
  createdAt: el.created_at || new Date().toISOString(),
  updatedAt: el.updated_at || new Date().toISOString(),
  title: el.title || '',
  content: el.content || '',
  views: el.views || 0,
});
