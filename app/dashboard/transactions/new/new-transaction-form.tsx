"use client";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import { type Category } from "@/types/Category";
import React from "react";
import { z } from "zod";
import { createTransaction } from "./action";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const NewTransactionForm = ({ categories }: { categories: Category[] }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      categoryId: data.categoryId,
      description: data.description,
    });

    if (result.error) {
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
          description: "Transaction created successfully!",
          variant: "success",
        });
      }, 0);
    }
    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );
  };

  return <TransactionForm categories={categories} onSubmit={handleSubmit} />;
};

export default NewTransactionForm;
