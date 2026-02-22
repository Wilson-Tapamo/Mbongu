import { db } from '../../src/db/index.js';
import { sales, products } from '../../src/db/schema.js';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { shopId, total, items, paymentMethod, customerName, customerPhone } = req.body;

        // 1. Insert the sale
        const [newSale] = await db.insert(sales).values({
            shopId,
            total,
            items, // JSONB field
            paymentMethod,
            customerName,
            customerPhone,
        }).returning();

        // 2. Update stock for each product in the sale
        for (const item of items) {
            await db.update(products)
                .set({
                    stock: sql`${products.stock} - ${item.quantity}`
                })
                .where(eq(products.id, item.productId));
        }

        return res.status(201).json(newSale);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
