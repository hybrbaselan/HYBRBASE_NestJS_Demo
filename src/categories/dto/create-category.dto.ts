import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;
}
