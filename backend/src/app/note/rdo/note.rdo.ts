import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteRdo {
  @ApiProperty({
    description: 'Уникальный идентификатор заметки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Автор заметки',
    example: 'user@example.com',
  })
  author: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: string;

  @ApiPropertyOptional({
    description: 'Заголовок заметки',
    example: 'Моя первая заметка',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Содержание заметки',
    example: 'Текст заметки...',
  })
  content: string;

  @ApiProperty({
    description: 'Количество просмотров',
    example: 42,
  })
  views: number;
}
