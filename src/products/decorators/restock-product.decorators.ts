import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RestockProductDto } from '../dto';
import { Product } from '../entities';

export function RestockProductSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Restock a product' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiBody({ type: RestockProductDto }),
    ApiResponse({
      status: 200,
      description: 'The product stock has been successfully updated.',
      type: Product,
    }),
  );
}
