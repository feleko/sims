import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../impl';
import { ProductsService } from '../../products.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly productsService: ProductsService) {}

  async execute(command: CreateProductCommand) {
    const { name, description, price, stock } = command;
    return await this.productsService.createProduct({
      name,
      description,
      price,
      stock,
    });
  }
}
