import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(applicationRef) {
    super(applicationRef);
  }

  catch(exception: any, host: ArgumentsHost) {
    const createError = require('http-errors');
    if (createError.isHttpError(exception)) {
      this.applicationRef.reply(
        host.getArgByIndex(1),
        exception.message,
        exception.status,
      );
    } else {
      super.catch(exception, host);
    }
  }
}
