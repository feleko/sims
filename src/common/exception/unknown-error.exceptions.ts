import { HttpException, HttpStatus } from '@nestjs/common';

export class UnknownErrorExceptions extends HttpException {
  constructor() {
    super('An unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
