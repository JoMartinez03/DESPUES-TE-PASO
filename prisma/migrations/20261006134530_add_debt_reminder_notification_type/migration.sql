-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'DEBT_REMINDER';

-- CreateIndex
CREATE INDEX "notifications_userId_type_relatedFriendshipId_createdAt_idx" ON "notifications"("userId", "type", "relatedFriendshipId", "createdAt");
