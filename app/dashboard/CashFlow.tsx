import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnualCashFlow } from "@/data/getAnnualCashFlow";
import { getTransactionYearsRang } from "@/data/getTransactionYearsRange";
import React from "react";
import CashFlowFilters from "./CashFlowFilters";
import CashFlowContent from "./CashFlowContent";

const CashFlow = async ({ year }: { year: number }) => {
  const [cashFlow, yearsRange] = await Promise.all([
    getAnnualCashFlow(year),
    getTransactionYearsRang(),
  ]);
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cash Flow</span>
          <CashFlowFilters yearsRange={yearsRange} year={year} />
        </CardTitle>
        <CardContent className="grid grid-cols-[1fr_250px]">
          <CashFlowContent annualCashFlow={cashFlow} />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default CashFlow;
