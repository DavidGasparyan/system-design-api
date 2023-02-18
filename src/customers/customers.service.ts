import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async getByEmail(email: string): Promise<Customer> {
    const customer = await this.customersRepository.findOneBy({ email });

    if (customer) {
      return customer;
    }

    throw new NotFoundException('Customer with this email does not exist');
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOneBy({ id });

    if (customer) {
      return customer;
    }

    throw new NotFoundException('Customer with this id does not exist');
  }

  async create(customerData: CreateCustomerDto): Promise<Customer> {
    return new Customer(await this.customersRepository.save(customerData));
  }

  findAll() {
    return `This action returns all customers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
