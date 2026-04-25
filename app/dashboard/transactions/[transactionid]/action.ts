"use server";

import { db } from "@/db";
import { TransactionTable } from "@/db/schema";
import { transactionSchema } from "@/validation/transactionSchema";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const updateTransactionSchema = transactionSchema.and(
  z.object({ id: z.number() }),
);

export async function updateTransaction(data: {
  id: number;
  transactionDate: string;
  description: string;
  amount: number;
  categoryId: number;
}) {
  const validation = updateTransactionSchema.safeParse(data);
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "unauthorized",
    };
  }
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }
  await db
    .update(TransactionTable)
    .set({
      description: data.description,
      amount: data.amount.toString(),
      transactiondate: data.transactionDate,
      categoryId: data.categoryId,
    })
    .where(
      and(
        eq(TransactionTable.id, data.id),
        eq(TransactionTable.userId, userId),
      ),
    );
}

export async function deleteTransaction(transactionId:number){
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "unauthorized",
    };
  }
  await db.delete(TransactionTable).where(
    and(
      eq(TransactionTable.id,transactionId),
    eq(TransactionTable.userId,userId)
  )
)

}
