-- CreateEnum
CREATE TYPE "public"."user_activity_status_enum" AS ENUM ('available', 'busy', 'do_not_disturb', 'away', 'offline', 'invisible');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."user_status_enum" ADD VALUE 'pending_verification';
ALTER TYPE "public"."user_status_enum" ADD VALUE 'locked';
ALTER TYPE "public"."user_status_enum" ADD VALUE 'on_leave';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "activity_status" "public"."user_activity_status_enum" NOT NULL DEFAULT 'available',
ADD COLUMN     "is_online" BOOLEAN DEFAULT false,
ADD COLUMN     "last_activity_at" TIMESTAMPTZ(6),
ADD COLUMN     "last_seen_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "idx_users_online" ON "public"."users"("is_online");

-- CreateIndex
CREATE INDEX "idx_users_activity_status" ON "public"."users"("activity_status");

-- CreateIndex
CREATE INDEX "idx_users_last_seen" ON "public"."users"("last_seen_at");

-- CreateIndex
CREATE INDEX "idx_users_last_activity" ON "public"."users"("last_activity_at");
