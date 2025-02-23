import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { CreateCartDto, UpdateCartDto } from './dto/request.dto';
import { CartResponseDto } from './dto/response.dto';
import { IUserToken } from '../common/interface/user-token.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async create(
    createCartDto: CreateCartDto,
    userData: IUserToken,
  ): Promise<CartResponseDto> {
    const user = await this.userService.findOne(userData.sub);
    const product = await this.productService.findOne(createCartDto.productId);
    const cart = this.cartRepository.create({
      ...createCartDto,
      user,
      product,
    });
    await this.cartRepository.save(cart);
    return this.mapToResponseDto(cart);
  }

  async findAll(
    filter?: {
      productId?: number;
      minQuantity?: number;
      maxQuantity?: number;
    },
    pagination?: { page?: number; limit?: number },
  ): Promise<{ data: CartResponseDto[]; total: number }> {
    const query = this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    // Apply filters
    if (filter) {
      if (filter.productId) {
        query.andWhere('cart.productId = :productId', {
          productId: filter.productId,
        });
      }
      if (filter.minQuantity && filter.maxQuantity) {
        query.andWhere('cart.quantity BETWEEN :minQuantity AND :maxQuantity', {
          minQuantity: filter.minQuantity,
          maxQuantity: filter.maxQuantity,
        });
      } else if (filter.minQuantity) {
        query.andWhere('cart.quantity >= :minQuantity', {
          minQuantity: filter.minQuantity,
        });
      } else if (filter.maxQuantity) {
        query.andWhere('cart.quantity <= :maxQuantity', {
          maxQuantity: filter.maxQuantity,
        });
      }
    }

    // Apply pagination
    if (pagination) {
      const { page = 1, limit = 10 } = pagination;
      query.skip((page - 1) * limit).take(limit);
    }

    const [carts, total] = await query.getManyAndCount();
    return {
      data: carts.map((cart) => this.mapToResponseDto(cart)),
      total,
    };
  }

  async findOne(id: number): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          categories: true,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return this.mapToResponseDto(cart);
  }

  async update(
    id: number,
    updateCartDto: UpdateCartDto,
    userData: IUserToken,
  ): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: {
        id,
        user: {
          id: userData.sub,
        },
      },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    const user = await this.userService.findOneFull(userData.sub);
    cart.user = user;
    if (updateCartDto.productId) {
      const product = await this.productService.findOneFull(
        updateCartDto.productId,
      );
      cart.product = product;
    }
    await this.cartRepository.save(cart);
    return this.mapToResponseDto(cart);
  }

  async remove(id: number, userData: IUserToken): Promise<void> {
    const result = await this.cartRepository.delete({
      id: id,
      user: { id: userData.sub },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    const { id, user, product, quantity, createdAt, updatedAt } = cart;
    return {
      id,
      userId: user.id,
      productId: product.id,
      product: product,
      user: user,
      quantity,
      createdAt,
      updatedAt,
    };
  }
}
