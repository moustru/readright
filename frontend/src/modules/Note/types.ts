export type NoteDto = {
  id: number;
  author: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  views: number;
};

export type NoteRequest = {
  author: string;
  title: string;
  content: string;
};

export type NoteProps = {
  noteId: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  views: number;
};
