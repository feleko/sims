import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestockProductCommand } from '../impl';
import { ProductsService } from '../../products.service';

@CommandHandler(RestockProductCommand)
export class RestockProductHandler
  implements ICommandHandler<RestockProductCommand>
{
  constructor(private readonly productsService: ProductsService) {}

  async execute(command: RestockProductCommand) {
    return this.productsService.restockProduct(command);
  }
}
