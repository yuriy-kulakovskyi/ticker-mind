import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter}
 * catches {@link Prisma.PrismaClientKnownRequestError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError, Prisma?.PrismaClientInitializationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping,
  ) {
    super(applicationRef);

    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }

  /**
   * @param exception
   * @param host
   * @returns
   */

  catch(
    exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientInitializationError | any,
    host: ArgumentsHost,
  ) {
    // Recursively check for P6002 error code in nested properties
    const findP6002 = (err: any): boolean => {
      if (!err || typeof err !== 'object') return false;
      if (err.code === 'P6002') return true;
      if (err.body && err.body.code === 'P6002') return true;
      if (err.meta && err.meta.code === 'P6002') return true;
      // Check for nested error in body or meta
      return findP6002(err.body) || findP6002(err.meta);
    };
    if (findP6002(exception)) {
      const statusCode = HttpStatus.UNAUTHORIZED;
      const message = 'Prisma API Key is invalid. Please check your database credentials or API key.';
      super.catch(new HttpException({ statusCode, message }, statusCode), host);
      return;
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.catchClientKnownRequestError(exception, host);
    }
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Database connection error: invalid database URL or unreachable database.';
      super.catch(new HttpException({ statusCode, message }, statusCode), host);
      return;
    }
    // fallback to base filter
    return super.catch(exception, host);
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    // Custom handling for P6002 (invalid API key)
    if (exception.code === 'P6002') {
      const statusCode = HttpStatus.UNAUTHORIZED;
      const message = 'Prisma API Key is invalid. Please check your database credentials or API key.';
      super.catch(new HttpException({ statusCode, message }, statusCode), host);
      return;
    }

    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = `[${exception.code}]: ${this.exceptionShortMessage(exception.message)}`;

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }


  // Removed catchNotFoundError: Not needed, handled by P2025 error code

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}