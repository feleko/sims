import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class SellProductDto {
  @ApiProperty({ example: 1 })
  @JoiSchema(
    Joi.number().positive().required().messages({
      'number.base': 'Quantity must be a number',
      'number.empty': 'Quantity is required',
      'any.required': 'Quantity is required',
      'number.positive': 'Quantity must be a positive number',
    }),
  )
  quantity: number;
}
