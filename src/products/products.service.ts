import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);

    product.name = createProductDto.name;
    product.quantity = createProductDto.quantity;
    product.price = createProductDto.price;

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update({ id }, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
