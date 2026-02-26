import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { type Response, type Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(exceptionResponse);

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exceptionResponse,
    });
  }
}
