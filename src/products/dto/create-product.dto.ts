import { IsString, IsNumber, IsNotEmpty, IsPositive, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;
}
