import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto/request.dto';
import { CartResponseDto } from './dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorators/user.decorator';
import { IUserToken } from '../common/interface/user-token.interface';

@Controller('carts')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(
    @Body() createCartDto: CreateCartDto,
    @User() user: IUserToken,
  ): Promise<CartResponseDto> {
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  async findAll(
    @Query('productId', new DefaultValuePipe(0), ParseIntPipe)
    productId?: number,
    @Query('minQuantity', new DefaultValuePipe(0), ParseIntPipe)
    minQuantity?: number,
    @Query('maxQuantity', new DefaultValuePipe(100), ParseIntPipe)
    maxQuantity?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ): Promise<{ data: CartResponseDto[]; total: number }> {
    const filter = {
      productId,
      minQuantity,
      maxQuantity,
    };
    const pagination = { page, limit };
    return this.cartService.findAll(filter, pagination);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @User() user: IUserToken,
  ): Promise<CartResponseDto> {
    return this.cartService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @User() user: IUserToken,
  ): Promise<CartResponseDto> {
    return this.cartService.update(+id, updateCartDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUserToken): Promise<void> {
    return this.cartService.remove(+id, user);
  }
}
