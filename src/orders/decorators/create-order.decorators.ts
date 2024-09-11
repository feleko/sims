import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { applyDecorators } from '@nestjs/common';
import { Order } from '../entities';

export function CreateOrderSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new order' }),
    ApiBody({ type: CreateOrderDto }),
    ApiResponse({
      status: 201,
      description: 'The order has been successfully created.',
      type: Order,
    }),
  );
}
