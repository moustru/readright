import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Отображаемое имя',
    example: 'John M.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'Пароль',
    minLength: 6,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}
