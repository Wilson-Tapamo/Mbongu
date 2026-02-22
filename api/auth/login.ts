import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.phone, phone),
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                shopId: user.shopId,
            }
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
