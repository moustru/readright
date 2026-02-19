import { Note } from './models/note.model';
import { NOTE_REPOSITORY_TOKEN } from './note.constants';

export const NoteProviders = [
  {
    provide: NOTE_REPOSITORY_TOKEN,
    useValue: Note,
  },
];
