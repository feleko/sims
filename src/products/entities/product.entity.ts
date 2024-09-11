import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    description: 'The id of the product',
    example: '66e2d206786ec273101d3f1d',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Product1',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Product description',
  })
  description: string;

  @ApiProperty({ description: 'The price of the product', example: 10.5 })
  price: number;

  @ApiProperty({ description: 'The stock of the product', example: 100 })
  stock: number;
}

export type Products = Array<Product>;
