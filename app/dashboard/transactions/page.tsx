import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getCategories } from "@/data/getCategories";
import Link from "next/link";
import NewTransactionForm from "./new/new-transaction-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import {
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PencilIcon } from "lucide-react";
import numeral from "numeral";
import { Badge } from "@/components/ui/badge";
import Filters from "./filters";
import { getTransactionYearsRang } from "@/data/getTransactionYearsRange";
const today = new Date();
const searchSchema = z.object({
  year: z.coerce
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear() + 1)
    .catch(today.getFullYear()),
  month: z.coerce
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1),
});

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const searchParamsValues = await searchParams;
  const { month, year } = searchSchema.parse(searchParamsValues);
  const selectDate = new Date(year, month - 1, 1);
  const transactions = await getTransactionsByMonth({ month, year });
  const yearsRange = await getTransactionYearsRang();

  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transactions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{format(selectDate, "MMM yyyy")} Traansactions</span>
            <div>
              <Filters year={year} month={month} yearsRange={yearsRange} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/transactions/new">New Transaction</Link>
          </Button>
          {!transactions?.length && (
            <p className="text-center py-10 text-lg text-muted-foreground">
              There are no Tranx for this month
            </p>
          )}
          {!!transactions?.length && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>

                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>

                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {format(tx.transactiondate, "do MMMM yyyy")}
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell className="capitalize">
                        <Badge
                          className={
                            tx.transactionType === "income"
                              ? "bg-green-400"
                              : "bg-orange-500"
                          }
                        >
                          {tx.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell>
                        DKK {numeral(tx.amount).format("0,0[.]00")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          asChild
                          size="icon"
                          aria-label="Edit Transactions"
                        >
                          <Link href={`/dashboard/transactions/${tx.id}`}>
                            <PencilIcon />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
