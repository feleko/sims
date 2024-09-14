import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProductCommand,
  RestockProductCommand,
  SellProductCommand,
} from './commands';
import { GetProductsQuery } from './queries/impl/get-products.query';
import { CreateProductDto, RestockProductDto, SellProductDto } from './dto';
import { Product, Products } from './entities';
import { IdParamDto } from '../common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(commandBus).toBeDefined();
    expect(queryBus).toBeDefined();
  });

  describe('getProducts', () => {
    it('should execute GetProductsQuery', async () => {
      const products: Products = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          stock: 10,
        },
      ];
      (queryBus.execute as jest.Mock).mockResolvedValue(products);

      const result = await controller.getProducts();
      expect(result).toEqual(products);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetProductsQuery());
    });
  });

  describe('createProduct', () => {
    it('should execute CreateProductCommand', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 100,
        stock: 20,
      };
      const createdProduct: Product = {
        id: '1',
        ...createProductDto,
      };

      (commandBus.execute as jest.Mock).mockResolvedValue(createdProduct);

      const result = await controller.createProduct(createProductDto);
      expect(result).toEqual(createdProduct);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateProductCommand(
          createProductDto.name,
          createProductDto.description,
          createProductDto.price,
          createProductDto.stock,
        ),
      );
    });
  });

  describe('restockProduct', () => {
    it('should execute RestockProductCommand', async () => {
      const params: IdParamDto = { id: '1' };
      const restockProductDto: RestockProductDto = { quantity: 5 };
      const updatedProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Desc',
        price: 100,
        stock: 15,
      };

      (commandBus.execute as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await controller.restockProduct(params, restockProductDto);
      expect(result).toEqual(updatedProduct);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new RestockProductCommand(params.id, restockProductDto.quantity),
      );
    });
  });

  describe('sellProduct', () => {
    it('should execute SellProductCommand', async () => {
      const params: IdParamDto = { id: '1' };
      const sellProductDto: SellProductDto = { quantity: 3 };
      const updatedProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Desc',
        price: 100,
        stock: 7,
      };

      (commandBus.execute as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await controller.sellProduct(params, sellProductDto);
      expect(result).toEqual(updatedProduct);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new SellProductCommand(params.id, sellProductDto.quantity),
      );
    });
  });
});
