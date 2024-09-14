import { ICreatProductDto } from '../../dto';

export class CreateProductCommand implements ICreatProductDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}
}
