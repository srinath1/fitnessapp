"use client";
import { SelectContent, SelectValue } from "@radix-ui/react-select";
import {
  SelectTrigger,
  Select,
  SelectItem,
} from "../../../components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Filters({
  year,
  month,
  yearsRange,
}: {
  year: number;
  month: number;
  yearsRange: number[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  return (
    <div className="flex gap-1">
      <Select
        value={selectedMonth.toString()}
        onValueChange={(newValue) => setSelectedMonth(Number(newValue))}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }).map((_, i) => {
            return (
              <SelectItem key={i} value={`${i + 1}`}>
                {format(new Date(selectedYear, i, 1), "MMM")}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select
        value={selectedYear.toString()}
        onValueChange={(newValue) => {
          return setSelectedYear(Number(newValue));
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearsRange.map((year) => {
            return (
              <SelectItem key={year} value={`${year}`}>
                {year}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link
          href={`/dashboard/transactions?year=${selectedYear}&month=${selectedMonth}`}
        >
          Go
        </Link>
      </Button>
    </div>
  );
}
