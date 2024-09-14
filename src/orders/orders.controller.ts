import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Order } from './entities';
import { CreateOrderSwagger } from './decorators';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly commandBus: CommandBus) {}

  @CreateOrderSwagger()
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, products } = createOrderDto;
    return this.commandBus.execute(
      new CreateOrderCommand(customerId, products),
    );
  }
}
