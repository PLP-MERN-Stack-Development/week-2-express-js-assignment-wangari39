# Express.js Product API

## 📦 Setup
1. Install dependencies:
```bash
npm install express body-parser uuid
```
2. Start the server:
```bash
node server.js
```

## 🔐 API Key
Include a header `x-api-key: 12345` in all requests.

## 🔁 API Endpoints

### Get all products (with optional filters)
`GET /api/products?category=Fruits&page=1&limit=5&search=apple`

### Get a specific product
`GET /api/products/:id`

### Create a product
`POST /api/products`
```json
{
  "name": "Apple",
  "description": "Fresh red apple",
  "price": 1.99,
  "category": "Fruits",
  "inStock": true
}
```

### Update a product
`PUT /api/products/:id`

### Delete a product
`DELETE /api/products/:id`

### Get product statistics
`GET /api/statistics`

## 🛡️ Middleware
- Logger
- JSON body parser
- API key auth
- Product validator

## ⚠️ Error Handling
- 404: Not found
- 400: Validation errors
- 401: Unauthorized