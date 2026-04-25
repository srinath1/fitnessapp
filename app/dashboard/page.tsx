import React from "react";
import RecentTransactions from "./recentTransactions";
import CashFlow from "./CashFlow";
import { year } from "drizzle-orm/mysql-core";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cfyear: string }>;
}) {
  const today = new Date();
  const searchParamsValues = await searchParams;
  let cfYear = Number(searchParamsValues.cfyear ?? today.getFullYear());

  if (isNaN(cfYear)) {
    cfYear = today.getFullYear();
  }

  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <CashFlow year={cfYear} />
      <RecentTransactions />
    </div>
  );
}
