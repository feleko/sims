import { OrderProducts } from '../../entities';

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly products: OrderProducts,
  ) {}
}
