import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  BadRequestException,
  Req,
  NotFoundException,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NoteRdo } from './rdo/note.rdo';
import { WithAuth } from 'src/common/decorators/auth.decorator';
import type { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '../user/interfaces/jwt.interface';
import { NoteRdoInterceptor } from './interceptors/note-rdo.interceptor';
import { Note } from './models/note.model';

@ApiTags('Notes')
@WithAuth()
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({
    summary: 'Создание записи',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() dto: CreateNoteDto, @Req() req: Request) {
    const token = req.cookies['accessToken'] as string;

    const res = decode(token) as JwtPayload | null;

    if (res) {
      return this.noteService.create(res.user_id, dto);
    } else {
      return new NotFoundException('Пользователь не найден');
    }
  }

  @ApiOperation({
    summary: 'Получение всех записей',
  })
  @ApiOkResponse({
    description: 'Успешное получение всех записей',
  })
  @ApiNotFoundResponse({
    description: 'Записи не найдены',
  })
  @Get()
  @UseInterceptors(NoteRdoInterceptor)
  findAll(): Promise<Note[]> {
    return this.noteService.findAll();
  }

  @ApiOperation({
    summary: 'Получение записи по ID',
  })
  @ApiOkResponse({
    description: 'Успешное получение записи',
    type: NoteRdo,
  })
  @ApiNotFoundResponse({
    description: 'Запись не найдена',
  })
  @ApiParam({ name: 'id', description: 'Идентификатор записи' })
  @Get(':id')
  @UseInterceptors(NoteRdoInterceptor)
  async findOne(@Param('id') id: string): Promise<Note> {
    const noteId = Number.parseInt(id, 10);

    if (Number.isNaN(noteId)) {
      throw new BadRequestException('Invalid Note ID');
    }

    return await this.noteService.findOne(noteId);
  }

  @ApiOperation({
    summary: 'Обновление записи по ID',
  })
  @ApiParam({ name: 'id', description: 'Идентификатор записи' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateNoteDto,
  ) {
    const token = req.cookies['accessToken'] as string;

    const res = decode(token) as JwtPayload | null;

    return this.noteService.update(res!.user_id, +id, dto);
  }

  @ApiOperation({
    summary: 'Удаление записи по ID',
  })
  @ApiParam({ name: 'id', description: 'Идентификатор записи' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const token = req.cookies['accessToken'] as string;

    const res = decode(token) as JwtPayload | null;

    return this.noteService.remove(res!.user_id, +id);
  }
}
