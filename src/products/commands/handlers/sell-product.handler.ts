import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SellProductCommand } from '../impl';
import { ProductsService } from '../../products.service';

@CommandHandler(SellProductCommand)
export class SellProductHandler implements ICommandHandler<SellProductCommand> {
  constructor(private readonly productsService: ProductsService) {}

  async execute(command: SellProductCommand) {
    return this.productsService.sellProduct(command);
  }
}
