import { db } from "@/db";
import { categoriesTable, TransactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql, sum } from "drizzle-orm";
import "server-only";

export async function getAnnualCashFlow(year: number) {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const month = sql`EXTRACT(MONTH FROM ${TransactionTable.transactiondate})`;

  const cashflow = await db
    .select({
      month,
      totalincome: sum(
        sql`CASE WHEN ${categoriesTable.type}='income' THEN ${TransactionTable.amount} ELSE 0 END`,
      ),
      totalExpenses: sum(
        sql`CASE WHEN ${categoriesTable.type}='expense' THEN ${TransactionTable.amount} ELSE 0 END`,
      ),
    })
    .from(TransactionTable)
    .leftJoin(
      categoriesTable,
      eq(TransactionTable.categoryId, categoriesTable.id),
    )
    .where(
      and(
        eq(TransactionTable.userId, userId),
        sql`EXTRACT(Year FROM ${TransactionTable.transactiondate})=${year}`,
      ),
    )
    .groupBy(month);
  const annualCashflow: {
    month: number;
    income: number;
    expenses: number;
  }[] = [];
  for (let i = 1; i <= 12; i++) {
    const monthlyCashFlow = cashflow.find((cf) => Number(cf.month) === i);
    annualCashflow.push({
      month: i,
      income: Number(monthlyCashFlow?.totalincome ?? 0),
      expenses: Number(monthlyCashFlow?.totalExpenses ?? 0),
    });
  }
  return annualCashflow;
}
