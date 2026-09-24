-- AlterTable: una fila por par de usuarios (A->B y B->A son la misma relación)
ALTER TABLE "friendships" ADD COLUMN "pairKey" TEXT;

-- Backfill para filas existentes (ids ordenados de forma estable)
UPDATE "friendships"
SET "pairKey" = LEAST("requesterId", "addresseeId") || ':' || GREATEST("requesterId", "addresseeId");

ALTER TABLE "friendships" ALTER COLUMN "pairKey" SET NOT NULL;

-- DropIndex
DROP INDEX "friendships_requesterId_addresseeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "friendships_pairKey_key" ON "friendships"("pairKey");
