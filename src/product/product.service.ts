import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/request.dto';
import { ProductResponseDto } from './dto/response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private categoryService: CategoryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const categories = await this.categoryService.findByIds(
      createProductDto.categoryIds,
    );
    const product = this.productRepository.create({
      ...createProductDto,
      categories,
    });
    await this.productRepository.save(product);
    return this.mapToResponseDto(product);
  }

  async find(
    filter?: {
      name?: string;
      minPrice?: number;
      maxPrice?: number;
      categoryIds?: number[];
    },
    pagination?: { page?: number; limit?: number },
  ): Promise<{ data: ProductResponseDto[]; total: number }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category');

    if (filter) {
      if (filter.name) {
        query.andWhere('product.name LIKE :name', { name: `%${filter.name}%` });
      }
      if (filter.minPrice && filter.maxPrice) {
        query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: filter.minPrice,
          maxPrice: filter.maxPrice,
        });
      } else if (filter.minPrice) {
        query.andWhere('product.price >= :minPrice', {
          minPrice: filter.minPrice,
        });
      } else if (filter.maxPrice) {
        query.andWhere('product.price <= :maxPrice', {
          maxPrice: filter.maxPrice,
        });
      }
      if (filter.categoryIds && filter.categoryIds.length > 0) {
        query.andWhere('category.id IN (:...categoryIds)', {
          categoryIds: filter.categoryIds,
        });
      }
    }

    if (pagination) {
      const { page = 1, limit = 10 } = pagination;
      query.skip((page - 1) * limit).take(limit);
    }

    const [products, total] = await query.getManyAndCount();
    return {
      data: products.map((product) => this.mapToResponseDto(product)),
      total,
    };
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async findOneFull(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.categoryIds) {
      const categories = await this.categoryService.findByIds(
        updateProductDto.categoryIds,
      );
      product.categories = categories;
    }

    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);
    return this.mapToResponseDto(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    const { id, name, description, price, categories, createdAt, updatedAt } =
      product;
    return {
      id,
      name,
      description,
      price,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      createdAt,
      updatedAt,
    };
  }
}
