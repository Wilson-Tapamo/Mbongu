import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, phone, password, role } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.phone, phone),
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({
            name,
            phone,
            password: hashedPassword,
            role: role || 'seller',
        }).returning();

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role,
            }
        });
    } catch (error: any) {
        console.error('[REGISTER ERROR]', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}