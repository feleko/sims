import { Id } from '../../common';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProduct {
  @ApiProperty({
    description: 'The id of the product',
    example: '66e2d206786ec273101d3f1d',
  })
  productId: Id;

  @ApiProperty({ description: 'The quantity of the product', example: 2 })
  quantity: number;
}

export type OrderProducts = Array<OrderProduct>;

export class Order {
  @ApiProperty({ description: 'The id of the order', example: '1' })
  id: Id;

  @ApiProperty({ description: 'The id of the customer', example: '1' })
  customerId: Id;

  @ApiProperty({
    description: 'The products of the order',
    type: [OrderProduct],
  })
  orderItems: OrderProducts;
}
