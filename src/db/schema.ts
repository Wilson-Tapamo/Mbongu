import { pgTable, text, timestamp, uuid, integer, decimal } from 'drizzle-orm/pg-core';

export const shops = pgTable('shops', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    location: text('location'),
    ownerId: uuid('owner_id'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique(),
    phone: text('phone').unique().notNull(),
    password: text('password').notNull(),
    role: text('role').default('seller').notNull(), // 'director' or 'seller'
    shopId: uuid('shop_id').references(() => shops.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    shopId: uuid('shop_id').references(() => shops.id).notNull(),
    name: text('name').notNull(),
    sku: text('sku'),
    cost: decimal('cost', { precision: 12, scale: 2 }).notNull(),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    stock: integer('stock').default(0).notNull(),
    minStock: integer('min_stock').default(5).notNull(),
    category: text('category').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const sales = pgTable('sales', {
    id: uuid('id').defaultRandom().primaryKey(),
    shopId: uuid('shop_id').references(() => shops.id).notNull(),
    sellerId: uuid('seller_id').references(() => users.id).notNull(),
    total: decimal('total', { precision: 12, scale: 2 }).notNull(),
    paymentMethod: text('payment_method').notNull(), // 'CASH', 'MOMO', 'OM'
    createdAt: timestamp('created_at').defaultNow(),
});

export const saleItems = pgTable('sale_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    saleId: uuid('sale_id').references(() => sales.id).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
});

export const expenses = pgTable('expenses', {
    id: uuid('id').defaultRandom().primaryKey(),
    shopId: uuid('shop_id').references(() => shops.id).notNull(),
    category: text('category').notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    date: timestamp('date').defaultNow(),
});
