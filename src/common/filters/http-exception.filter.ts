import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { SimulationAlreadyRunningError } from '../../simulation/domain/errors/simulation-already-running.error';
import { SimulationNotFinishedError } from '../../simulation/domain/errors/simulation-not-finished.error';
import { SimulationNotRunningError } from '../../simulation/domain/errors/simulation-not-running.error';
import { SimulationStartThrottledError } from '../../simulation/domain/errors/simulation-start-throttled.error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json(exceptionResponse);
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof SimulationAlreadyRunningError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof SimulationNotRunningError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof SimulationNotFinishedError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof SimulationStartThrottledError) {
      status = HttpStatus.TOO_MANY_REQUESTS;
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
