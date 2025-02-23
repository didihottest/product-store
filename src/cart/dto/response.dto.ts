import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';

export class CartResponseDto {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
  user: User;
}
