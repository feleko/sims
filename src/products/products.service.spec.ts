import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import {
  InsufficientStockException,
  NoProductFoundException,
} from './exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrorCodes } from '../common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Desc',
        price: 100,
        stock: 10,
      };
      const createdProduct = { id: '1', ...productData };

      (prismaService.product.create as jest.Mock).mockResolvedValue(
        createdProduct,
      );

      const result = await service.createProduct(productData);
      expect(result).toEqual(createdProduct);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: productData,
      });
    });
  });

  describe('getProducts', () => {
    it('should return list of products', async () => {
      const products = [{ id: '1', name: 'Test Product', stock: 10 }];
      (prismaService.product.findMany as jest.Mock).mockResolvedValue(products);

      const result = await service.getProducts();
      expect(result).toEqual(products);
      expect(prismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('restockProduct', () => {
    it('should restock a product', async () => {
      const productData = { id: '1', stock: 10 };
      const updatedProduct = { ...productData, stock: 15 };
      (prismaService.product.update as jest.Mock).mockResolvedValue(
        updatedProduct,
      );

      const result = await service.restockProduct({
        productId: '1',
        quantity: 5,
      });
      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { stock: { increment: 5 } },
      });
    });

    it('should throw NoProductFoundException when product not found', async () => {
      const error = new PrismaClientKnownRequestError('Record not found', {
        code: PrismaErrorCodes.RecordDoesNotExist,
        clientVersion: '2.0.0',
      });
      (prismaService.product.update as jest.Mock).mockRejectedValue(error);

      await expect(
        service.restockProduct({ productId: '1', quantity: 5 }),
      ).rejects.toThrow(NoProductFoundException);
    });
  });

  describe('sellProduct', () => {
    it('should sell a product', async () => {
      const productData = { id: '1', stock: 10 };
      const updatedProduct = { ...productData, stock: 5 };
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
        productData,
      );
      (prismaService.product.update as jest.Mock).mockResolvedValue(
        updatedProduct,
      );

      const result = await service.sellProduct({ productId: '1', quantity: 5 });
      expect(result).toEqual(updatedProduct);
      expect(prismaService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { stock: { decrement: 5 } },
      });
    });

    it('should throw NoProductFoundException when product not found', async () => {
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.sellProduct({ productId: '1', quantity: 5 }),
      ).rejects.toThrow(NoProductFoundException);
    });

    it('should throw InsufficientStockException when stock is insufficient', async () => {
      const productData = { id: '1', stock: 3 };
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
        productData,
      );

      await expect(
        service.sellProduct({ productId: '1', quantity: 5 }),
      ).rejects.toThrow(InsufficientStockException);
    });
  });
});
