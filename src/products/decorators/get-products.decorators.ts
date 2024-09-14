import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '../entities';

export function GetProductsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all products' }),
    ApiResponse({
      status: 200,
      description: 'Return all products.',
      type: [Product],
    }),
  );
}
