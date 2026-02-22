import { db } from '../../src/db';
import { expenses } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            const { shopId } = req.query;
            if (!shopId) return res.status(400).json({ message: 'ShopId is required' });

            const recentExpenses = await db.select()
                .from(expenses)
                .where(eq(expenses.shopId, shopId as string))
                .orderBy(desc(expenses.date))
                .limit(50);

            return res.status(200).json(recentExpenses);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { shopId, amount, description, category, date } = req.body;

            const [newExpense] = await db.insert(expenses).values({
                shopId,
                amount,
                description,
                category,
                date: date || new Date().toISOString(),
            }).returning();

            return res.status(201).json(newExpense);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
