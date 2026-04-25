import { db } from "@/db";
import { TransactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import "server-only";
export async function getTransactionYearsRang() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }
  const [earliestTransaction] = await db
    .select()
    .from(TransactionTable)
    .where(eq(TransactionTable.userId, userId))
    .orderBy(asc(TransactionTable.transactiondate))
    .limit(1);

  const today = new Date();
  const currentYear = today.getFullYear();
  const earliestYear = earliestTransaction
    ? new Date(earliestTransaction.transactiondate).getFullYear()
    : currentYear;
  const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
    (_, i) => {
      return currentYear - i;
    },
  );
  return years;
}
