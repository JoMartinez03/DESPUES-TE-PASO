/*
  Issue 4 - Juntadas:

  - ExpenseSplitType enum
  - Expense: payerId (backfill = createdById) y splitType
  - ExpenseParticipant: shareAmount (backfill = 0, luego NOT NULL sin default)
  - Transaction: expenseId nullable (FK ON DELETE CASCADE como red de seguridad)
  - GatheringParticipant: tabla intermedia (backfill de participantes = creadores existentes)
*/

-- CreateEnum
CREATE TYPE "ExpenseSplitType" AS ENUM ('EQUAL', 'CUSTOM');

-- AlterTable: expense_participants.shareAmount
ALTER TABLE "expense_participants" ADD COLUMN "shareAmount" DECIMAL(14,2);

UPDATE "expense_participants" SET "shareAmount" = 0 WHERE "shareAmount" IS NULL;

ALTER TABLE "expense_participants" ALTER COLUMN "shareAmount" SET NOT NULL;

-- AlterTable: expenses.payerId (backfill = creador, igual que el payer actual) y splitType
ALTER TABLE "expenses" ADD COLUMN "payerId" TEXT;

UPDATE "expenses" SET "payerId" = "createdById" WHERE "payerId" IS NULL;

ALTER TABLE "expenses" ALTER COLUMN "payerId" SET NOT NULL;

ALTER TABLE "expenses" ADD COLUMN "splitType" "ExpenseSplitType" NOT NULL DEFAULT 'EQUAL';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "expenseId" TEXT;

-- CreateTable
CREATE TABLE "gathering_participants" (
    "id" TEXT NOT NULL,
    "gatheringId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gathering_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gathering_participants_userId_idx" ON "gathering_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "gathering_participants_gatheringId_userId_key" ON "gathering_participants"("gatheringId", "userId");

-- CreateIndex
CREATE INDEX "expenses_payerId_idx" ON "expenses"("payerId");

-- CreateIndex
CREATE INDEX "transactions_expenseId_idx" ON "transactions"("expenseId");

-- Backfill: los creadores de juntadas existentes quedan como participantes
INSERT INTO "gathering_participants" ("id", "gatheringId", "userId", "createdAt")
SELECT gen_random_uuid(), "g"."id", "g"."creatorId", CURRENT_TIMESTAMP FROM "gatherings" g
ON CONFLICT ("gatheringId", "userId") DO NOTHING;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gathering_participants" ADD CONSTRAINT "gathering_participants_gatheringId_fkey" FOREIGN KEY ("gatheringId") REFERENCES "gatherings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gathering_participants" ADD CONSTRAINT "gathering_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "transactions_status_creditor_debtor_idx" RENAME TO "transactions_status_creditorId_debtorId_idx";

-- RenameIndex
ALTER INDEX "transactions_status_debtor_creditor_idx" RENAME TO "transactions_status_debtorId_creditorId_idx";