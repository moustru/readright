import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filters';
import { SwaggerModule } from '@nestjs/swagger';
import getSwaggerDocument from './config/swagger.config';
import cookieParser from 'cookie-parser';
// import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  // Временно, потом настроим как надо
  app.enableCors();

  // Мидлвара логгера
  app.use(LoggerMiddleware);

  // Демонстрация подключения guard глобально
  // app.useGlobalGuards(new AuthGuard());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  SwaggerModule.setup('/docs', app, getSwaggerDocument(app));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
