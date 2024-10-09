import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";

export interface IProductsService {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(page?: number, query?: string, minPrice?: number, maxPrice?: number, categoryId?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<{ items: Product[]; total: number; page: number; lastPage: number }>;
  findOne(id: number): Promise<Product>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: number);
}