import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  BadRequestException,
  UseGuards,
  // UseFilters,
  // UseGuards,
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
// import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filters';
// import { AuthGuard } from 'src/common/guards/auth.guard';
// import { StringToLowercasePipe } from 'src/common/pipes/string-to-lowercase.pipe';

@ApiTags('Notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Демонстрация точечного применения guard
  // @UseGuards(AuthGuard)

  // Демонстрация точечного применения filters
  // @UseFilters(AllExceptionsFilter)
  @ApiOperation({
    summary: 'Создание записи',
  })
  // @ApiBody({
  //   description: 'Данные для создания записи',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       author: { type: 'string', example: 'user' },
  //       title: { type: 'string', example: 'Заголовок заметки' },
  //       content: { type: 'string', example: 'Содержимое заметки' },
  //     },
  //   },
  // })
  @Post()
  create(
    @Body() dto: CreateNoteDto,
    // Демонстрация пайпа
    // @Body('author', StringToLowercasePipe) author: string,
  ) {
    // dto.author = author;

    return this.noteService.create(dto);
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
  findAll() {
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
  findOne(@Param('id') id: string) {
    const noteId = parseInt(id, 10);

    if (isNaN(noteId)) {
      throw new BadRequestException('Invalid Note ID');
    }

    return this.noteService.findOne(noteId);
  }

  @ApiOperation({
    summary: 'Обновление записи по ID',
  })
  @ApiParam({ name: 'id', description: 'Идентификатор записи' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.noteService.update(+id, dto);
  }

  @ApiOperation({
    summary: 'Удаление записи по ID',
  })
  @ApiParam({ name: 'id', description: 'Идентификатор записи' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(+id);
  }
}
