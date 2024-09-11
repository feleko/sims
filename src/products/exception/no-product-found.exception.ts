import { HttpException, HttpStatus } from '@nestjs/common';

export class NoProductFoundException extends HttpException {
  constructor(productId: string) {
    super(`No product found with id ${productId}`, HttpStatus.NOT_FOUND);
  }
}
