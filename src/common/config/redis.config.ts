import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    isGlobal: true,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  };
});
