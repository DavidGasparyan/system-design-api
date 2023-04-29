import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CustomersService } from '../../customers/customers.service';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../../common/enums/postgres-error-codes.enum';
import { Customer } from '../../customers/entities/customer.entity';
import { JwtTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as util from 'util';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RedisKeys } from '../../common/enums/redis-keys.enum';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  payload: JwtTokenPayload;

  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly redisService: Cache,
    private readonly configService: ConfigService,
  ) {}

  async register(registrationData: CreateCustomerDto): Promise<Customer> {
    if (registrationData.password !== registrationData.confirmPassword) {
      throw new UnprocessableEntityException('Passwords are not matching.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registrationData.password, salt);

    try {
      return await this.customersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'Customer with that email already exists',
        );
      }

      Logger.error('[authService] registration error', util.inspect(error));
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async getAuthenticatedCustomer(
    email: string,
    plainTextPassword: string,
  ): Promise<Customer> {
    try {
      const customer = await this.customersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, customer.password);
      return customer;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async createJwtAccessToken(customer: Customer): Promise<string> {
    this.payload = {
      customerId: customer.id,
    };
    return await this.jwtService.signAsync(this.payload);
  }

  async createJwtRefreshToken(
    customerId: string,
    refreshTokenId: string,
  ): Promise<string> {
    this.payload = {
      customerId: customerId,
    };
    const refreshToken = await this.jwtService.signAsync(this.payload, {
      privateKey: fs
        .readFileSync(
          this.configService.get<string>('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
        )
        .toString(),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    const redisResponse = await this.redisService.set(
      `${RedisKeys.RefreshToken}:${customerId}:${refreshTokenId}`,
      hashedRefreshToken,
      86400,
    );

    return refreshToken;
  }

  async validateJwtRefreshToken(
    customerId: string,
    refreshToken: string,
    refreshTokenId: string,
  ): Promise<Customer> {
    const customer = await this.customersService.getById(customerId);

    const savedRefreshToken: string = await this.redisService.get(
      `${RedisKeys.RefreshToken}:${customer.id}:${refreshTokenId}`,
    );

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      savedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new BadRequestException('The refresh tokens do not match');
    }

    if (savedRefreshToken) {
      return customer;
    } else {
      throw new NotFoundException('The refresh token was not found');
    }
  }

  async removeJwtRefreshToken(
    customerId: string,
    refreshTokenId: string,
  ): Promise<Customer> {
    const customer = await this.customersService.getById(customerId);

    const deletedResult = await this.redisService.del(
      `${RedisKeys.RefreshToken}:${customer.id}:${refreshTokenId}`,
    );

    return customer;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
