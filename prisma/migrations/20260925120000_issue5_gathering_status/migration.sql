CREATE TYPE "GatheringStatus" AS ENUM ('ACTIVE', 'CLOSED');

ALTER TABLE "gatherings"
ADD COLUMN "status" "GatheringStatus" NOT NULL DEFAULT 'ACTIVE';

ALTER TABLE "gatherings"
ADD COLUMN "closedAt" TIMESTAMP(3);

ALTER TABLE "gatherings"
ADD CONSTRAINT "gatherings_status_closed_at_check"
CHECK (
  ("status" = 'CLOSED' AND "closedAt" IS NOT NULL)
  OR ("status" = 'ACTIVE' AND "closedAt" IS NULL)
);
