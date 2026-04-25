import { db } from "@/db";
import { categoriesTable, TransactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { gte, eq, and, lte, desc } from "drizzle-orm";
import { format } from "date-fns";

export async function getTransactionsByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const earliestdate = new Date(year, month - 1, 1);
  const laterDate = new Date(year, month, 0);

  const transactions = await db
    .select({
      id: TransactionTable.id,
      description: TransactionTable.description,
      amount: TransactionTable.amount,
      transactiondate: TransactionTable.transactiondate,
      category: categoriesTable.name,
      transactionType: categoriesTable.type,
    })
    .from(TransactionTable)
    .where(
      and(
        eq(TransactionTable.userId, userId),
        gte(
          TransactionTable.transactiondate,
          format(earliestdate, "yyyy-MM-dd"),
        ),
        lte(TransactionTable.transactiondate, format(laterDate, "yyyy-MM-dd")),
      ),
    )
    .orderBy(desc(TransactionTable.transactiondate))
    .leftJoin(
      categoriesTable,
      eq(TransactionTable.categoryId, categoriesTable.id),
    );
  return transactions;
}
