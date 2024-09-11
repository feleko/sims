import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProductsQuery } from './queries/impl/get-products.query';
import {
  CreateProductCommand,
  RestockProductCommand,
  SellProductCommand,
} from './commands';
import { CreateProductDto, RestockProductDto, SellProductDto } from './dto';
import { IdParamDto } from '../common';
import { Product, Products } from './entities';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateProductSwagger,
  GetProductsSwagger,
  RestockProductSwagger,
  SellProductSwagger,
} from './decorators';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GetProductsSwagger()
  @Get()
  async getProducts(): Promise<Products> {
    return this.queryBus.execute(new GetProductsQuery());
  }

  @CreateProductSwagger()
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { name, description, price, stock } = createProductDto;
    return this.commandBus.execute(
      new CreateProductCommand(name, description, price, stock),
    );
  }

  @RestockProductSwagger()
  @Post(':id/restock')
  async restockProduct(
    @Param() params: IdParamDto,
    @Body() restockProductDto: RestockProductDto,
  ): Promise<Product> {
    return this.commandBus.execute(
      new RestockProductCommand(params.id, restockProductDto.quantity),
    );
  }

  @SellProductSwagger()
  @Post(':id/sell')
  async sellProduct(
    @Param() params: IdParamDto,
    @Body() sellProductDto: SellProductDto,
  ): Promise<Product> {
    return this.commandBus.execute(
      new SellProductCommand(params.id, sellProductDto.quantity),
    );
  }
}
