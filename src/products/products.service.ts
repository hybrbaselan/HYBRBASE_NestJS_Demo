import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ConfigService } from '@nestjs/config';
import { IProductsService } from './interfaces/products-service.interface';

@Injectable()
export class ProductsService implements IProductsService {
  private readonly itemsPerPage: number;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {
    this.itemsPerPage = this.configService.get<number>('pagination.itemsPerPage');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
      }

      const product = this.productRepository.create(createProductDto);
      product.category = category;
      const result = await this.productRepository.save(product);
      this.logger.log(`Product created with ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll(page?: number, query?: string, minPrice?: number, maxPrice?: number, categoryId?: number, sortBy: string = 'id', sortOrder: 'ASC' | 'DESC' = 'ASC') {
    try {
      this.logger.log(`Fetching products with page: ${page} and query: ${query}`);
      const queryBuilder = this.productRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category');

      if (query) {
        queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:query) OR LOWER(category.name) LIKE LOWER(:query)', { query: `%${query}%` });
      }

      if (minPrice) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
      }

      if (maxPrice) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
      }

      if (categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', { categoryId });
      }

      queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

      const total = await queryBuilder.getCount();
      this.logger.log(`Total products found: ${total}`);
      const items = await queryBuilder
        .skip(page ? (page - 1) * this.itemsPerPage : 0)
        .take(this.itemsPerPage)
        .getMany();

      return { 
        items, 
        total, 
        page: page || 1, 
        lastPage: Math.ceil(total / this.itemsPerPage) 
      };
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Fetching product with ID: ${id}`);
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching product: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      this.logger.log(`Updating product with ID: ${id}`);
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
      }

      product.category = category;
      return this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating product: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update product');
    }
  }
  
  async remove(id: number) {
    try {
      this.logger.log(`Deleting product with ID: ${id}`);
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting product: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
