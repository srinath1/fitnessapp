import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getCategories } from "@/data/getCategories";
import EditNewTransactionForm from "./editTransactionForm";
import { getTransaction } from "@/data/getTransaction";
import { notFound } from "next/navigation";
import DeleteTransaction from "./deleteTransaction";

const EditPage = async ({
  params,
}: {
  params: Promise<{ transactionid: string }>;
}) => {
  const paramValues = await params;
  const categories = await getCategories();

  const transactionid = Number(paramValues.transactionid);
  if (isNaN(transactionid)) {
    notFound();
  }
  const transaction = await getTransaction(transactionid);

  if (!transaction) {
    notFound();
  }

  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <DeleteTransaction
            transactionId={transaction.id}
            transactionDate={transaction.transactiondate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditNewTransactionForm
          categories={categories}
          transaction={transaction}
        />
      </CardContent>
    </Card>
  );
};

export default EditPage;
