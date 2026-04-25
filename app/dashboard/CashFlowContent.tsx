"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import React from "react";
import numeral from "numeral";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CashFlowContent = ({
  annualCashFlow,
}: {
  annualCashFlow: Array<{ month: number; income: number; expenses: number }>;
}) => {
  const today = new Date();
  const totalAnnualIncome = annualCashFlow.reduce(
    (prevValue: number, month) => {
      return prevValue + month.income;
    },
    0,
  );
  const totalAnnualExpenses = annualCashFlow.reduce(
    (prevValue: number, month) => {
      return prevValue + month.expenses;
    },
    0,
  );
  const balance = totalAnnualIncome - totalAnnualExpenses;
  return (
    <>
      <ChartContainer
        config={{
          income: {
            label: "Income",
            color: "green",
          },
          expenses: {
            label: "Expenses",
            color: "red",
          },
        }}
        className="w-full h-[300px]"
      >
        <BarChart data={annualCashFlow}>
          <CartesianGrid vertical={false} />
          <YAxis
            tickFormatter={(value) => {
              return `DKK ${numeral(value).format("0,0")}`;
            }}
          />
          <XAxis
            tickFormatter={(value) => {
              return format(new Date(today.getFullYear(), value, 1), "MMM");
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value, payload) => {
                  const month = payload[0]?.payload?.month;
                  return (
                    <div>
                      {format(
                        new Date(today.getFullYear(), month - 1, 1),
                        "MMM",
                      )}
                    </div>
                  );
                }}
              />
            }
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={30}
            iconType="circle"
            formatter={(value) => {
              return (
                <span className="capitalize text-primary text-bold text-xl">
                  {value}
                </span>
              );
            }}
          />
          <Bar dataKey="income" radius={4} fill="var(--color-income)" />
          <Bar dataKey="expenses" radius={4} fill="var(--color-expenses)" />
        </BarChart>
      </ChartContainer>
      <div className="border-l px-4 flex flex-col gap-4 justify-center">
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Income
          </span>
          <h2 className="text-3xl">
            DKK {numeral(totalAnnualIncome).format("0.0[.]00")}
          </h2>
        </div>
        <div className="border-t" />
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Expenses
          </span>
          <h2 className="text-3xl">
            DKK {numeral(totalAnnualExpenses).format("0.0[.]00")}
          </h2>
        </div>
        <div className="border-t" />
        <div>
          <span className="text-muted-foreground font-bold text-sm">
            Expenses
          </span>
          <h2
            className={cn(
              "text-3xl font-bold",
              balance >= 0 ? "text-lime-800" : "text-orange-800",
            )}
          >
            DKK {numeral(balance).format("0.0[.]00")}
          </h2>
        </div>
      </div>
    </>
  );
};

export default CashFlowContent;
