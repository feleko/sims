import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SellProductDto } from '../dto';
import { Product } from '../entities';

export function SellProductSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Sell a product' }),
    ApiParam({ name: 'id', description: 'Product ID' }),
    ApiBody({ type: SellProductDto }),
    ApiResponse({
      status: 200,
      description: 'The product has been successfully sold and stock updated.',
      type: Product,
    }),
  );
}
