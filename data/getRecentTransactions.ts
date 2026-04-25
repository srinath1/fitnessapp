import { db } from "@/db";
import { categoriesTable, TransactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import "server-only";

export async function getRecentTransactions() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const transactions = await db
    .select({
      id: TransactionTable.id,
      description: TransactionTable.description,
      amount: TransactionTable.amount,
      transactionDate: TransactionTable.transactiondate,
      category: categoriesTable.name,
      transactionType: categoriesTable.type,
    })
    .from(TransactionTable)
    .where(eq(TransactionTable.userId, userId))
    .orderBy(desc(TransactionTable.transactiondate))
    .limit(5)
    .leftJoin(
      categoriesTable,
      eq(TransactionTable.categoryId, categoriesTable.id),
    );

  return transactions;
}
