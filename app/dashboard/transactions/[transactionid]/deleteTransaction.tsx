"use client";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import React from "react";
import { deleteTransaction } from "./action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeleteTransaction = ({
  transactionId,
  transactionDate,
}: {
  transactionId: number;
  transactionDate: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleDelete = async () => {
    const result = await deleteTransaction(transactionId);
    if (result?.error) {
      toast({
        title: "Error",
        description: result?.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Transaction Deleted",
      variant: "success",
    });
    const [year, month] = transactionDate.split("-");
    router.push(`/dashboard/transactions?month=${month}&year=${year}`);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This transaction will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransaction;
