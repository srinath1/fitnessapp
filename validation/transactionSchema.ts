import { addDays, subYears } from "date-fns";
import { z } from "zod";
export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must be atleast 3 chars")
    .max(300, "cant be more than maximum of 300 chars"),
  categoryId: z.number().positive("CategoryID is not valid"),
  transactionDate: z.coerce
    .date()
    .min(subYears(new Date(), 100))
    .max(addDays(new Date(), 1)),
});