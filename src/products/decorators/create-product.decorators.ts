import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from '../dto';
import { Product } from '../entities';

export function CreateProductSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product' }),
    ApiBody({ type: CreateProductDto }),
    ApiResponse({
      status: 201,
      description: 'The product has been successfully created.',
      type: Product,
    }),
  );
}
