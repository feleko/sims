import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from '../impl/get-products.query';
import { ProductsService } from '../../products.service';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly productsService: ProductsService) {}

  async execute() {
    return this.productsService.getProducts();
  }
}
