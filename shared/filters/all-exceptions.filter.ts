import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal server error';


    let detail: string;

    if (typeof message === 'string') {
      detail = message;
    } else if (typeof message === 'object' && message !== null) {
      detail =
        (message as { message?: string }).message || 'Internal server error';
    } else {
      detail = 'Internal server error';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      detail,
      title: HttpStatus[status],
    });
  }
}