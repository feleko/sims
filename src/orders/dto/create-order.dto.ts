import { Id } from '../../common';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { OrderProduct, OrderProducts } from '../entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '1' })
  @JoiSchema(Joi.string().id().required())
  customerId: Id;

  @ApiProperty({
    type: [OrderProduct],
    example: [
      {
        id: '66e2d206786ec273101d3f1d',
        productId: '66e2d206786ec273101d3f1d',
        quantity: 2,
        orderId: '66e2d206786ec273101d3f1d',
      },
    ],
  })
  @JoiSchema(
    Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().id().required().messages({
            'string.base': 'Product ID must be a string',
            'string.id': 'Product ID must be a valid UUID',
            'string.required': 'Product ID is required',
          }),
          quantity: Joi.number().positive().required().messages({
            'number.base': 'Quantity must be a number',
            'number.positive': 'Quantity must be a positive number',
            'number.required': 'Quantity is required',
          }),
        }),
      )
      .required()
      .messages({
        'array.base': 'Products must be an array',
        'array.required': 'Products are required',
      }),
  )
  products: OrderProducts;
}
