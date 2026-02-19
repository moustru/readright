import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Автор заметки',
    example: 'user',
  })
  @IsString({ message: 'Поле author должно быть строкой' })
  @IsNotEmpty()
  @Length(2, 255)
  author: string;

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
