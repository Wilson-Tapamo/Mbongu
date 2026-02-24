import { db } from '../../src/db/index.js';
import { shops } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { userId } = req.query;
            if (!userId) return res.status(400).json({ message: 'User ID is required' });

            const userShops = await db.select().from(shops).where(eq(shops.ownerId, userId as string)).orderBy(desc(shops.name));
            return res.status(200).json(userShops);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, location, ownerId } = req.body;
            const [newShop] = await db.insert(shops).values({
                name,
                location,
                ownerId,
            }).returning();
            return res.status(201).json(newShop);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
