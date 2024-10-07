# HYBRBASE NestJS Demo

## Description

This is a demo project using the NestJS framework to build an API for a product and category management system. The project includes CRUD operations for both products and categories, with a one-to-many relationship between categories and products.

## Prerequisites

- Node.js (v14 or later recommended)
- Yarn package manager
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hybrbaselan/HYBRBASE_NestJS_Demo.git
   cd HYBRBASE_NestJS_Demo
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up the database:
   - Create a `.env` file in the root directory
   - Copy the content from `.env` (if it exists) or add the following:
     ```
     DATABASE_HOST=localhost
     DATABASE_PORT=5432
     DATABASE_USERNAME=your_username
     DATABASE_PASSWORD=your_password
     DATABASE_NAME=your_database_name
     ```
   - Replace `your_username`, `your_password` and `your_database_name` with your PostgreSQL credentials

## Running the app

   ### Development mode
       yarn run start
   
   ### Development mode
       yarn run start:dev
   
   ### Development mode
       yarn run start:prod

## API Endpoints

### Categories

- `GET /categories`: Fetch all categories
- `GET /categories/:id`: Fetch a specific category
- `POST /categories`: Create a new category
- `PATCH /categories/:id`: Update a category
- `DELETE /categories/:id`: Delete a category

### Products

- `GET /products`: Fetch all products
- `GET /products/:id`: Fetch a specific product
- `POST /products`: Create a new product
- `PATCH /products/:id`: Update a product
- `DELETE /products/:id`: Delete a product

## Testing

   ### Unit tests
       yarn run test
   
   ### E2E tests
       yarn run test:e2e
   
   ### Test coverage
       yarn run test:cov

## Project Structure

- `src/categories`: Contains all files related to the categories module
- `src/products`: Contains all files related to the products module
- `src/main.ts`: The entry point of the application
