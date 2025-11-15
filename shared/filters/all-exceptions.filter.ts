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

    // Check for Prisma P6002 error code, even if nested in P5000 error message


    function isObject(val: unknown): val is { [key: string]: unknown } {
      return typeof val === 'object' && val !== null;
    }

    function isString(val: unknown): val is string {
      return typeof val === 'string';
    }

    const findP6002 = (err: unknown): boolean => {
      if (!err) return false;
      if (isObject(err)) {
        if ('code' in err && err.code === 'P6002') return true;
        if ('body' in err && isObject(err.body) && 'code' in err.body && err.body.code === 'P6002') return true;
        if ('meta' in err && isObject(err.meta) && 'code' in err.meta && err.meta.code === 'P6002') return true;
        // Special case: Prisma P5000 with P6002 in message string
        if ('code' in err && err.code === 'P5000' && 'message' in err && isString(err.message)) {
          if (err.message.includes('code":"P6002"')) return true;
        }
        if ('body' in err && isObject(err.body) && findP6002(err.body)) return true;
        if ('meta' in err && isObject(err.meta) && findP6002(err.meta)) return true;
      }
      if (isString(err) && err.includes('code":"P6002"')) return true;
      return false;
    };

    if (findP6002(exception)) {
      const status = HttpStatus.UNAUTHORIZED;
      const detail = 'Prisma API Key is invalid. Please check your database credentials or API key.';
      response.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        detail,
        title: HttpStatus[status],
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR || 500;

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