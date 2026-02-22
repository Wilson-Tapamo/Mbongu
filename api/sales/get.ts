import { db } from '../../src/db';
import { sales } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { shopId } = req.query;
        if (!shopId) return res.status(400).json({ message: 'ShopId is required' });

        const recentSales = await db.select()
            .from(sales)
            .where(eq(sales.shopId, shopId as string))
            .orderBy(desc(sales.date))
            .limit(100);

        return res.status(200).json(recentSales);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
