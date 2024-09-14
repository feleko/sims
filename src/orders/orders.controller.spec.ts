import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-id',
        products: [
          { productId: 'product-id-1', quantity: 10 },
          { productId: 'product-id-2', quantity: 5 },
        ],
      };

      const createdOrder = {
        id: 'order-id',
        customerId: 'customer-id',
        // Assuming orderItems is a part of the Order model as per your schema
        orderItems: [
          { id: 'order-item-id-1', productId: 'product-id-1', quantity: 10 },
          { id: 'order-item-id-2', productId: 'product-id-2', quantity: 5 },
        ],
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(createdOrder);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(createdOrder);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateOrderCommand(
          createOrderDto.customerId,
          createOrderDto.products,
        ),
      );
    });

    it('should throw an error if commandBus.execute fails', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 'customer-id',
        products: [
          { productId: 'product-id-1', quantity: 10 },
          { productId: 'product-id-2', quantity: 5 },
        ],
      };

      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new Error('Failed to create order'));

      await expect(controller.createOrder(createOrderDto)).rejects.toThrow(
        'Failed to create order',
      );
    });
  });
});
