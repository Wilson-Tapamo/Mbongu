import { db } from '../../src/db/index.js';
import { products } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    const { shopId } = req.query;

    if (req.method === 'GET') {
        if (!shopId) return res.status(400).json({ message: 'Shop ID required' });
        try {
            const allProducts = await db.query.products.findMany({
                where: eq(products.shopId, shopId),
            });
            return res.status(200).json(allProducts);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, shopId, price, cost, stock, minStock, category } = req.body;
            const [newProduct] = await db.insert(products).values({
                name,
                shopId,
                price,
                cost,
                stock,
                minStock,
                category,
            }).returning();
            return res.status(201).json(newProduct);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
