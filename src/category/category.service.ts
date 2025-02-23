import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/request.dto';
import { CategoryResponseDto } from './dto/response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return this.mapToResponseDto(category);
  }

  async findAll(name?: string): Promise<CategoryResponseDto[]> {
    const query: FindOptionsWhere<CategoryResponseDto> = {};
    if (name) {
      query.name = name;
    }
    const categories = await this.categoryRepository.find({ where: query });
    return categories.map((category) => this.mapToResponseDto(category));
  }

  async find(
    filter?: { name?: string },
    pagination?: { page?: number; limit?: number },
  ): Promise<{ data: CategoryResponseDto[]; total: number }> {
    const query = this.categoryRepository.createQueryBuilder('category');

    // Apply filters
    if (filter?.name) {
      query.andWhere('category.name LIKE :name', { name: `%${filter.name}%` });
    }

    // Apply pagination
    if (pagination) {
      const { page = 1, limit = 10 } = pagination;
      query.skip((page - 1) * limit).take(limit);
    }

    const [categories, total] = await query.getManyAndCount();
    return {
      data: categories.map((category) => this.mapToResponseDto(category)),
      total,
    };
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    const categories = await this.categoryRepository.findBy({ id: In(ids) });
    if (categories.length !== ids.length) {
      throw new NotFoundException('One or more categories not found');
    }
    return categories;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.save(category);
    return this.mapToResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    const { id, name, createdAt, updatedAt } = category;
    return { id, name, createdAt, updatedAt };
  }
}
