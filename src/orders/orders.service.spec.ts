import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { OrderProduct } from './entities';
import {
  InsufficientStockException,
  NoProductFoundException,
} from '../products/exception';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            product: {
              findMany: jest.fn(),
              update: jest.fn(),
            },
            order: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const customerId = '1';
      const products: OrderProduct[] = [
        { productId: '1', quantity: 1 },
        { productId: '2', quantity: 2 },
      ];
      const product1: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 1,
      };
      const product2: Product = {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        stock: 2,
      };

      (prismaService.$transaction as jest.Mock).mockImplementation(async cb => {
        await cb(prismaService);
      });

      (prismaService.product.findMany as jest.Mock).mockResolvedValue([
        product1,
        product2,
      ]);

      (prismaService.product.update as jest.Mock).mockImplementation(
        async ({ where, data }) => {
          const product = where.id === '1' ? product1 : product2;
          return { ...product, stock: { decrement: data.stock.decrement } };
        },
      );

      (prismaService.order.create as jest.Mock).mockResolvedValue({
        id: '1',
        customerId,
        products,
      });
    });
  });

  describe('verifyProductsAvailability', () => {
    it('should throw an error if product is not found', async () => {
      const products: OrderProduct[] = [{ productId: '1', quantity: 1 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue([]);

      await expect(
        service['verifyProductsAvailability'](prismaService, products),
      ).rejects.toThrow(NoProductFoundException);
    });

    it('should throw an error if product stock is less than quantity', async () => {
      const products: OrderProduct[] = [{ productId: '1', quantity: 2 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', stock: 1 },
      ]);
      await expect(
        service['verifyProductsAvailability'](prismaService, products),
      ).rejects.toThrow(InsufficientStockException);
    });

    it('should not throw an error if product stock is greater than or equal to quantity', async () => {
      const products: OrderProduct[] = [{ productId: '1', quantity: 1 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', stock: 1 },
      ]);
      await expect(
        service['verifyProductsAvailability'](prismaService, products),
      ).resolves.toBeUndefined();
    });
  });

  describe('updateStockLevels', () => {
    it('should decrement stock levels', async () => {
      const products: OrderProduct[] = [
        { productId: '1', quantity: 1 },
        { productId: '2', quantity: 2 },
      ];
      (prismaService.product.update as jest.Mock).mockResolvedValue({
        id: '1',
        stock: 0,
      });
      await service['updateStockLevels'](prismaService, products);
      expect(prismaService.product.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('createOrderEntry', () => {
    it('should create an order entry', async () => {
      const customerId = '1';
      const products: OrderProduct[] = [
        { productId: '1', quantity: 1 },
        { productId: '2', quantity: 2 },
      ];
      (prismaService.order.create as jest.Mock).mockResolvedValue({
        id: '1',
        customerId,
        products,
      });
      await expect(
        service['createOrderEntry'](prismaService, customerId, products),
      ).resolves.toEqual({ id: '1', customerId, products });
    });
  });
});
