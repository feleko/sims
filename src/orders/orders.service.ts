import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order, PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import {
  InsufficientStockException,
  NoProductFoundException,
} from '../products/exception';
import { OrderProduct } from './entities';

type PrismaTransactionClient = Omit<PrismaClient, runtime.ITXClientDenyList>;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    customerId: string,
    products: OrderProduct[],
  ): Promise<Order> {
    return this.prisma.$transaction(async prisma => {
      await this.verifyProductsAvailability(prisma, products);
      await this.updateStockLevels(prisma, products);
      return this.createOrderEntry(prisma, customerId, products);
    });
  }

  private async verifyProductsAvailability(
    prisma: PrismaTransactionClient,
    products: OrderProduct[],
  ): Promise<void> {
    const productIds = products.map(product => product.productId);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(productsInDb.map(p => [p.id, p]));

    for (const { productId, quantity } of products) {
      const product = productMap.get(productId);
      if (!product) throw new NoProductFoundException(productId);
      if (product.stock < quantity) throw new InsufficientStockException();
    }
  }

  private async updateStockLevels(
    prisma: PrismaTransactionClient,
    products: OrderProduct[],
  ): Promise<void> {
    const BATCH_SIZE = 100; // Adjust batch size as needed
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const updates = batch.map(({ productId, quantity }) =>
        prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        }),
      );
      await Promise.all(updates);
    }
  }

  private async createOrderEntry(
    prisma: PrismaTransactionClient,
    customerId: string,
    products: OrderProduct[],
  ): Promise<Order> {
    return prisma.order.create({
      data: {
        customerId,
        orderItems: {
          create: products.map(({ productId, quantity }) => ({
            product: { connect: { id: productId } },
            quantity,
          })),
        },
      },
      include: { orderItems: true },
    });
  }
}
