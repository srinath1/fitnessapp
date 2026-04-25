"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type Category } from "@/types/Category";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import { z } from "zod";
import { updateTransaction } from "./action";
import { format } from "date-fns";

const EditNewTransactionForm = ({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction: {
    id: number;
    amount: string;
    categoryId: number;
    description: string;
    transactiondate: string;
  };
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await updateTransaction({
      id: transaction.id,
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      categoryId: data.categoryId,
      description: data.description,
    });

    if (result?.error) {
      // Use setTimeout to ensure this runs after render
      setTimeout(() => {
        toast({
          title: "Error",
          description: result.message,
        });
      }, 0);
    } else {
      // Optional: Show success message
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Transaction updated successfully!",
          variant: "success",
        });
      }, 0);
    }
    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );
  };

  return (
    <TransactionForm
      categories={categories}
      onSubmit={handleSubmit}
      defaultValues={{
        amount: Number(transaction.amount),
        categoryId: transaction.categoryId,
        description: transaction.description,
        transactionDate: new Date(transaction.transactiondate),
        transactionType:
          categories.find((category) => category.id === transaction.categoryId)
            ?.type ?? "income",
      }}
    />
  );
};

export default EditNewTransactionForm;
