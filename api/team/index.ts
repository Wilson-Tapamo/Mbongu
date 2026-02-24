import { db } from '../../src/db/index.js';
import { users, shops } from '../../src/db/schema.js';
import { eq, desc, or, inArray, sql } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { userId, shopId } = req.query;

            let filteredUsers = [];

            if (shopId) {
                // Get users for a specific shop
                filteredUsers = await db.select().from(users).where(eq(users.shopId, shopId as string)).orderBy(desc(users.name));
            } else if (userId) {
                // Get users for shops owned by this director
                const userShops = await db.select({ id: shops.id }).from(shops).where(eq(shops.ownerId, userId as string));
                const shopIds = userShops.map(s => s.id);

                if (shopIds.length > 0) {
                    // Build OR conditions for each shop
                    const conditions = shopIds.map(shopId => eq(users.shopId, shopId));
                    filteredUsers = await db.select().from(users).where(
                        or(...conditions)
                    ).orderBy(desc(users.name));
                }
            }

            return res.status(200).json(filteredUsers);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, email, role, shopId, password } = req.body;
            const [newUser] = await db.insert(users).values({
                name,
                email,
                role,
                shopId,
                password: password || '1234', // Default password for new members
            }).returning();
            return res.status(201).json(newUser);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ message: 'User ID is required' });
            await db.delete(users).where(eq(users.id, id as string));
            return res.status(200).json({ message: 'User deleted' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
