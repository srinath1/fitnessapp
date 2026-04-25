"use server";

import { db } from "@/db";
import { TransactionTable } from "@/db/schema";
import { transactionSchema } from "@/validation/transactionSchema";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { addDays, subYears } from "date-fns";
import { z } from "zod";

export const createTransaction = async (data: {
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "unauthorized",
    };
  }

  const validation = transactionSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }
  const [transaction] = await db
    .insert(TransactionTable)
    .values({
      userId,
      amount: data.amount.toString(),
      description: data.description,
      categoryId: data.categoryId,
      transactiondate: data.transactionDate,
    })
    .returning();
  return {
    id: transaction.id,
  };
};
