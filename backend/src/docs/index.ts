import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Readright API')
  .setDescription('API документация для Readright')
  .setVersion('1.0.0')
  .setContact('Eugene M.', 'https://t.me/moustru', 'xexyz@yandex.ru')
  // Включает авторизацию в Swagger UI, добавляя кнопку "Authorize" и поле для ввода токена
  // .addBearerAuth()
  .build();

const getSwaggerDocument = (app: INestApplication) =>
  SwaggerModule.createDocument(app, swaggerConfig);

export default getSwaggerDocument;
