import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderHandler } from './commands/handlers/create-order.handler';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { JoiPipeModule } from 'nestjs-joi';

@Module({
  imports: [CqrsModule, JoiPipeModule],
  providers: [PrismaService, OrdersService, CreateOrderHandler],
  controllers: [OrdersController],
})
export class OrdersModule {}
