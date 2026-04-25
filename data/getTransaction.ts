import { db } from "@/db"
import { TransactionTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import "server-only"

export async function getTransaction(transactionId:number){
    const {userId}=await auth()
    if(!userId){
        return null
    }
    const[transaction]=await db.select().from(TransactionTable).where(and(
        eq(TransactionTable.id,transactionId),
        eq(TransactionTable.userId,userId)
    ))
    return transaction
}