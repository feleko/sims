import * as Joi from 'joi';
import { Product } from '../entities';
import { JoiSchema } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

export type ICreatProductDto = Omit<Product, 'id'>;

export class CreateProductDto implements ICreatProductDto {
  @ApiProperty({ example: 'Product1' })
  @JoiSchema(
    Joi.string().max(50).required().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
      'string.max': 'Name must be at most {#limit} characters',
    }),
  )
  name: string;

  @ApiProperty({ example: 'Product description' })
  @JoiSchema(
    Joi.string().max(50).required().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'any.required': 'Description is required',
      'string.max': 'Description must be at most {#limit} characters',
    }),
  )
  description: string;

  @ApiProperty({ example: 10.5 })
  @JoiSchema(
    Joi.number().positive().required().messages({
      'number.base': 'Price must be a number',
      'number.empty': 'Price is required',
      'any.required': 'Price is required',
      'number.positive': 'Price must be a positive number',
    }),
  )
  price: number;

  @ApiProperty({ example: 100 })
  @JoiSchema(
    Joi.number().min(0).required().messages({
      'number.base': 'Stock must be a number',
      'number.empty': 'Stock is required',
      'any.required': 'Stock is required',
      'number.min': 'Stock must be at least {#limit}',
    }),
  )
  stock: number;
}
