/*
  Warnings:

  - You are about to drop the column `clerk_org_id` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerk_slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."organization_role_enum" AS ENUM ('admin', 'member', 'guest');

-- DropIndex
DROP INDEX "public"."idx_organizations_clerk_org_id";

-- DropIndex
DROP INDEX "public"."organizations_clerk_org_id_key";

-- AlterTable
ALTER TABLE "public"."organizations" DROP COLUMN "clerk_org_id",
DROP COLUMN "metadata",
DROP COLUMN "status",
ADD COLUMN     "clerk_id" VARCHAR(255),
ADD COLUMN     "clerk_slug" VARCHAR(255),
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."organization_memberships" (
    "id" UUID NOT NULL,
    "clerk_id" VARCHAR(255) NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."organization_role_enum" NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "joined_at" TIMESTAMPTZ(6),
    "invited_at" TIMESTAMPTZ(6),

    CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_memberships_clerk_id_key" ON "public"."organization_memberships"("clerk_id");

-- CreateIndex
CREATE INDEX "idx_org_memberships_org" ON "public"."organization_memberships"("organization_id");

-- CreateIndex
CREATE INDEX "idx_org_memberships_user" ON "public"."organization_memberships"("user_id");

-- CreateIndex
CREATE INDEX "idx_org_memberships_clerk" ON "public"."organization_memberships"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_org_membership_org_user" ON "public"."organization_memberships"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_id_key" ON "public"."organizations"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_slug_key" ON "public"."organizations"("clerk_slug");

-- CreateIndex
CREATE INDEX "idx_organizations_clerk" ON "public"."organizations"("clerk_id");

-- AddForeignKey
ALTER TABLE "public"."organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
