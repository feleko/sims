import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product, Products } from './entities';
import {
  InsufficientStockException,
  NoProductFoundException,
} from './exception';
import { PrismaErrorCodes, UnknownErrorExceptions } from '../common';
import {
  CreateProductCommand,
  RestockProductCommand,
  SellProductCommand,
} from './commands';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductCommand): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async getProducts(): Promise<Products> {
    return this.prisma.product.findMany();
  }

  async restockProduct({
    productId: id,
    quantity,
  }: RestockProductCommand): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: { stock: { increment: quantity } },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case PrismaErrorCodes.RecordDoesNotExist:
            throw new NoProductFoundException(id);
          default:
            throw new UnknownErrorExceptions();
        }
      } else {
        throw e;
      }
    }
  }

  async sellProduct({ productId: id, quantity }: SellProductCommand) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NoProductFoundException(id);

    if (product.stock < quantity) throw new InsufficientStockException();

    return this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}
