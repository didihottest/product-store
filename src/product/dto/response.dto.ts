export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categories: { id: number; name: string }[];
  createdAt: Date;
  updatedAt: Date;
}
