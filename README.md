## Description

Test For Superindo Backend

## Compile and run the project

```bash
$ docker-compose up --build

```

## curl endpoints

```bash
# AUTH
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}'
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'
# USER
curl -X GET http://localhost:3000/users \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET http://localhost:3000/users/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "email": "newuser@example.com",
  "password": "newpassword123",
  "name": "Jane Doe"
}'
curl -X PUT http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Updated Name"
}'
curl -X DELETE http://localhost:3000/users/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
# Categories
curl -X GET http://localhost:3000/categories \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET http://localhost:3000/categories/all \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET http://localhost:3000/categories/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Electronics"
}'
curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Electronics"
}'
curl -X DELETE http://localhost:3000/categories/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET "http://localhost:3000/categories?name=Electronics&page=1&limit=10" \
-H "Authorization: Bearer <JWT_TOKEN>"
# PRODUCT
curl -X GET http://localhost:3000/products \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET http://localhost:3000/products/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X POST http://localhost:3000/products/upload \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: multipart/form-data" \
-F "file=@/path/to/your/image.jpg"
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Smartphone",
  "description": "A high-end smartphone",
  "price": 699,
  "categoryIds": [1],
  "imageUrl": "/uploads/123456789-image.jpg"
}'
curl -X PUT http://localhost:3000/products/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Updated Smartphone",
  "price": 799
}'
curl -X DELETE http://localhost:3000/products/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET "http://localhost:3000/products?name=Smartphone&minPrice=500&maxPrice=1000&categoryIds=1,2&page=1&limit=10" \
-H "Authorization: Bearer <JWT_TOKEN>"
# CART
curl -X GET "http://localhost:3000/carts?productId=1&minQuantity=1&maxQuantity=5&page=1&limit=10" \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X GET http://localhost:3000/carts/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
curl -X POST http://localhost:3000/carts \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}'
curl -X PUT http://localhost:3000/carts/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "quantity": 3
}'
curl -X DELETE http://localhost:3000/carts/1 \
-H "Authorization: Bearer <JWT_TOKEN>"
```
