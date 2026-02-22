import { db } from '../../src/db';
import { shops } from '../../src/db/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const allShops = await db.select().from(shops).orderBy(desc(shops.name));
            return res.status(200).json(allShops);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, location } = req.body;
            const [newShop] = await db.insert(shops).values({
                name,
                location,
            }).returning();
            return res.status(201).json(newShop);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
