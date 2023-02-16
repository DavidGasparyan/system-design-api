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
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // return new Product(this.productsRepository.save(createProductDto));
    // return new Promise<Product>();
  }

  /*
    Maybe a pagination for this collection?
   */
  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: string): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update({ id }, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
