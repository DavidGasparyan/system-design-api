import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    CustomersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: fs
          .readFileSync(
            configService.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
          )
          .toString(),
        publicKey: fs
          .readFileSync(
            configService.get<string>('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
          )
          .toString(),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
          algorithm: 'RS256',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshStrategy],
})
export class AuthModule {}
