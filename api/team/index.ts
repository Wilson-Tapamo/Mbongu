import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const allUsers = await db.select().from(users).orderBy(desc(users.name));
            // Remove sensitive data if needed (passwords aren't in schema yet but anyway)
            return res.status(200).json(allUsers);
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
