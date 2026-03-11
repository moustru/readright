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
  title: string;
  content: string;
};

export type NoteProps = {
  noteId: number;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  views: number;
};
