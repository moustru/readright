import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, Note as NoteModel } from './models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { NOTE_REPOSITORY_TOKEN } from './note.constants';
import { User } from '../user/models/user.model';

@Injectable()
export class NoteService {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: typeof NoteModel,
  ) {}

  async create(user_id: string, { title, content }: CreateNoteDto) {
    await this.noteRepository.create({
      user_id,
      title,
      content,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return 'OK';
  }

  async findAll(): Promise<Note[]> {
    const notes = await this.noteRepository.findAll({
      include: [
        {
          model: User,
          required: false,
        },
      ],
    });

    return notes;
  }

  async findOne(id: number): Promise<Note> {
    const relatedNote = await this.noteRepository.findByPk(id, {
      include: [
        {
          model: User,
          required: false,
        },
      ],
    });

    if (!relatedNote) {
      throw new NotFoundException();
    }

    // Увеличиваем количество просмотров при каждом запросе заметки
    await relatedNote.increment('views');

    // Перезагружаем объект из БД, чтобы получить актуальные данные
    await relatedNote.reload();

    return relatedNote;
  }

  async update(user_id: string, id: number, { title, content }: UpdateNoteDto) {
    const updatedNote = await this.noteRepository.findByPk(id);

    if (updatedNote?.get().user_id !== user_id) {
      throw new ForbiddenException('Не хватает прав для выполнения операции');
    }

    await this.noteRepository.update(
      { title, content, updated_at: new Date().toISOString() },
      { where: { id } },
    );

    return this.findOne(id);
  }

  async remove(user_id: string, id: number) {
    const updatedNote = await this.noteRepository.findByPk(id);

    if (updatedNote?.get().user_id !== user_id) {
      throw new ForbiddenException('Не хватает прав для выполнения операции');
    }

    await this.noteRepository.destroy({
      where: { id },
    });

    return 'OK';
  }
}
