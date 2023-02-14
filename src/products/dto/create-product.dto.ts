import { IsNotEmpty, IsPositive, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(3, 32)
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Max(100)
  quantity: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Max(10000)
  price: number;
}
