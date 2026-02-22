import { db } from '../../src/db';
import { sales, expenses, products } from '../../src/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
    const { shopId } = req.query;
    if (!shopId) return res.status(400).json({ message: 'Shop ID required' });

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Total Sales
        const totalSales = await db.select({
            sum: sql<number>`sum(${sales.total})`
        }).from(sales).where(eq(sales.shopId, shopId));

        // Total Expenses
        const totalExpenses = await db.select({
            sum: sql<number>`sum(${expenses.amount})`
        }).from(expenses).where(eq(expenses.shopId, shopId));

        // Low Stock Count
        const lowStock = await db.select({
            count: sql<number>`count(*)`
        }).from(products).where(sql`${products.stock} <= ${products.minStock} AND ${products.shopId} = ${shopId}`);

        return res.status(200).json({
            revenue: totalSales[0]?.sum || 0,
            expenses: totalExpenses[0]?.sum || 0,
            profit: (totalSales[0]?.sum || 0) - (totalExpenses[0]?.sum || 0),
            lowStockCount: Number(lowStock[0]?.count) || 0,
            dailyStats: [], // Will implement chart data later
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
