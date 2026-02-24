import { db } from '../../src/db/index.js';
import { products } from '../../src/db/schema.js';
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
        console.log('POST /api/products called with body:', req.body);
        try {
            const { name, shopId, price, cost, stock, minStock, category } = req.body;

            console.log('Parsed fields:', { name, shopId, price, cost, stock, minStock, category });

            if (!name || !shopId || price === undefined || cost === undefined || stock === undefined || minStock === undefined || !category) {
                console.log('Validation failed - missing fields');
                return res.status(400).json({ message: 'Missing required fields', received: req.body });
            }

            const [newProduct] = await db.insert(products).values({
                name,
                shopId,
                price,
                cost,
                stock,
                minStock,
                category,
            }).returning();
            console.log('Product created successfully:', newProduct);
            return res.status(201).json(newProduct);
        } catch (error: any) {
            console.error('Error creating product:', error);
            return res.status(500).json({ message: error.message, stack: error.stack });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
