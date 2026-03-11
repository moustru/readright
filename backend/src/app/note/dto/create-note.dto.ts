import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiPropertyOptional({
    description: 'Заголовок заметки',
    example: 'Заголовок заметки',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Содержимое заметки',
    example: 'Содержимое заметки',
  })
  @IsString()
  content: string;
}
