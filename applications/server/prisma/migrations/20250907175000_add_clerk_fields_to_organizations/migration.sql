/*
  Warnings:

  - A unique constraint covering the columns `[clerk_org_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."organizations" ADD COLUMN     "clerk_org_id" VARCHAR(255),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "status" VARCHAR(50) DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_org_id_key" ON "public"."organizations"("clerk_org_id");

-- CreateIndex
CREATE INDEX "idx_organizations_clerk_org_id" ON "public"."organizations"("clerk_org_id");
