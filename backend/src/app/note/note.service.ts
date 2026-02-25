import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note as NoteModel } from './models/note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { NOTE_REPOSITORY_TOKEN } from './note.constants';
import { REDIS_CACHE_TIME } from 'src/common/redis/redis.constants';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class NoteService {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN) private noteRepository: typeof NoteModel,
    private redisService: RedisService,
  ) {}

  async create({ author, title, content }: CreateNoteDto) {
    await this.noteRepository.create({
      author,
      title,
      content,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return 'OK';
  }

  async findAll() {
    const cachedNotes = await this.redisService.getAll<NoteModel[]>('note:*');

    if (!cachedNotes?.length) {
      const notesData = await this.noteRepository.findAll();

      if (!notesData) {
        throw new NotFoundException();
      }

      return notesData;
    }

    return cachedNotes;
  }

  async findOne(id: number) {
    const cachedNote = await this.redisService.get<NoteModel>(`note:${id}`);

    if (cachedNote) {
      return cachedNote;
    }

    const relatedNote = await this.noteRepository.findByPk(id);

    if (!relatedNote) {
      throw new NotFoundException();
    }

    // Увеличиваем количество просмотров при каждом запросе заметки
    await relatedNote.increment('views');

    // Перезагружаем объект из БД, чтобы получить актуальные данные
    await relatedNote.reload();

    // Кэшируем заметку
    await this.redisService.set(`note:${id}`, relatedNote, REDIS_CACHE_TIME);

    return relatedNote;
  }

  async update(id: number, { author, title, content }: UpdateNoteDto) {
    await Promise.all([
      this.noteRepository.update(
        { author, title, content, updated_at: new Date().toISOString() },
        { where: { id } },
      ),

      // Удаляем кэшированную заметку при обновлении
      this.redisService.delete(`note:${id}`),
    ]);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.noteRepository.destroy({
      where: { id },
    });

    return 'OK';
  }
}
