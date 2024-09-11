import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { JoiPipeModule } from 'nestjs-joi';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { GetProductsHandler } from './queries/handlers/get-products.handler';
import { ProductsController } from './products.controller';
import { RestockProductHandler } from './commands/handlers/restock-product.handler';
import { SellProductHandler } from './commands/handlers/sell-product.handler';

@Module({
  imports: [CqrsModule, JoiPipeModule],
  providers: [
    PrismaService,
    ProductsService,
    ProductsService,
    CreateProductHandler,
    GetProductsHandler,
    RestockProductHandler,
    SellProductHandler,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
