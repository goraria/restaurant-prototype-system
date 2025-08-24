/*
  Warnings:

  - The values [private,group] on the enum `conversation_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [import,export,adjust] on the enum `inventory_transaction_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [video] on the enum `message_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [delivering] on the enum `order_status_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [left] on the enum `staff_status_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [user,moderator] on the enum `user_role_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [percent,fixed] on the enum `voucher_discount_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_default_billing` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `is_default_shipping` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `parent_category_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `last_message_id` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `inventory_transactions` table. All the data in the column will be lost.
  - You are about to alter the column `image_url` on the `menu_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `price_at_purchase` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `affiliate_user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `billing_address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_person_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_fee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `restaurant_chains` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cover_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `mfa_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `mfa_secret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `affiliate_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logistics_order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logistics_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_email_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total_price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `menu_item_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `customer_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurant_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `restaurant_chains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."restaurant_status_enum" AS ENUM ('active', 'inactive', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "public"."table_status_enum" AS ENUM ('available', 'occupied', 'reserved', 'maintenance', 'out_of_order');

-- CreateEnum
CREATE TYPE "public"."reservation_status_enum" AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "public"."table_order_status_enum" AS ENUM ('active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."order_type_enum" AS ENUM ('dine_in', 'takeaway', 'delivery');

-- CreateEnum
CREATE TYPE "public"."cooking_status_enum" AS ENUM ('pending', 'preparing', 'cooking', 'ready', 'served', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."payment_method_enum" AS ENUM ('cash', 'card', 'bank_transfer', 'momo', 'zalopay', 'viettelpay', 'vnpay', 'shopeepay', 'paypal');

-- CreateEnum
CREATE TYPE "public"."staff_shift_type_enum" AS ENUM ('morning', 'afternoon', 'evening', 'night', 'full_day', 'split_shift');

-- CreateEnum
CREATE TYPE "public"."staff_schedule_status_enum" AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'absent', 'late', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."promotion_type_enum" AS ENUM ('percentage', 'fixed_amount', 'buy_one_get_one', 'combo_deal', 'happy_hour', 'seasonal');

-- CreateEnum
CREATE TYPE "public"."review_status_enum" AS ENUM ('active', 'hidden', 'flagged', 'deleted');

-- CreateEnum
CREATE TYPE "public"."revenue_report_type_enum" AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."conversation_status_enum" AS ENUM ('active', 'resolved', 'closed');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."conversation_type_enum_new" AS ENUM ('support', 'feedback', 'complaint', 'inquiry');
ALTER TABLE "public"."conversations" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."conversations" ALTER COLUMN "type" TYPE "public"."conversation_type_enum_new" USING ("type"::text::"public"."conversation_type_enum_new");
ALTER TYPE "public"."conversation_type_enum" RENAME TO "conversation_type_enum_old";
ALTER TYPE "public"."conversation_type_enum_new" RENAME TO "conversation_type_enum";
DROP TYPE "public"."conversation_type_enum_old";
ALTER TABLE "public"."conversations" ALTER COLUMN "type" SET DEFAULT 'support';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."inventory_transaction_type_enum_new" AS ENUM ('purchase', 'usage', 'adjustment', 'waste', 'return', 'transfer');
ALTER TABLE "public"."inventory_transactions" ALTER COLUMN "type" TYPE "public"."inventory_transaction_type_enum_new" USING ("type"::text::"public"."inventory_transaction_type_enum_new");
ALTER TYPE "public"."inventory_transaction_type_enum" RENAME TO "inventory_transaction_type_enum_old";
ALTER TYPE "public"."inventory_transaction_type_enum_new" RENAME TO "inventory_transaction_type_enum";
DROP TYPE "public"."inventory_transaction_type_enum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."message_type_enum_new" AS ENUM ('text', 'image', 'file', 'system');
ALTER TABLE "public"."messages" ALTER COLUMN "message_type" DROP DEFAULT;
ALTER TABLE "public"."messages" ALTER COLUMN "message_type" TYPE "public"."message_type_enum_new" USING ("message_type"::text::"public"."message_type_enum_new");
ALTER TYPE "public"."message_type_enum" RENAME TO "message_type_enum_old";
ALTER TYPE "public"."message_type_enum_new" RENAME TO "message_type_enum";
DROP TYPE "public"."message_type_enum_old";
ALTER TABLE "public"."messages" ALTER COLUMN "message_type" SET DEFAULT 'text';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."order_status_enum_new" AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."orders" ALTER COLUMN "status" TYPE "public"."order_status_enum_new" USING ("status"::text::"public"."order_status_enum_new");
ALTER TABLE "public"."order_status_history" ALTER COLUMN "status" TYPE "public"."order_status_enum_new" USING ("status"::text::"public"."order_status_enum_new");
ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old";
ALTER TYPE "public"."order_status_enum_new" RENAME TO "order_status_enum";
DROP TYPE "public"."order_status_enum_old";
ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."payment_status_enum" ADD VALUE 'processing';
ALTER TYPE "public"."payment_status_enum" ADD VALUE 'cancelled';
ALTER TYPE "public"."payment_status_enum" ADD VALUE 'refunded';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."restaurant_staff_role_enum" ADD VALUE 'supervisor';
ALTER TYPE "public"."restaurant_staff_role_enum" ADD VALUE 'sous_chef';
ALTER TYPE "public"."restaurant_staff_role_enum" ADD VALUE 'waiter';
ALTER TYPE "public"."restaurant_staff_role_enum" ADD VALUE 'host';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."staff_status_enum_new" AS ENUM ('active', 'inactive', 'on_leave', 'suspended', 'terminated');
ALTER TABLE "public"."restaurant_staffs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."restaurant_staffs" ALTER COLUMN "status" TYPE "public"."staff_status_enum_new" USING ("status"::text::"public"."staff_status_enum_new");
ALTER TYPE "public"."staff_status_enum" RENAME TO "staff_status_enum_old";
ALTER TYPE "public"."staff_status_enum_new" RENAME TO "staff_status_enum";
DROP TYPE "public"."staff_status_enum_old";
ALTER TABLE "public"."restaurant_staffs" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."user_role_enum_new" AS ENUM ('customer', 'staff', 'manager', 'admin', 'super_admin');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."user_role_enum_new" USING ("role"::text::"public"."user_role_enum_new");
ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old";
ALTER TYPE "public"."user_role_enum_new" RENAME TO "user_role_enum";
DROP TYPE "public"."user_role_enum_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'customer';
COMMIT;

-- AlterEnum
ALTER TYPE "public"."user_status_enum" ADD VALUE 'suspended';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."voucher_discount_type_enum_new" AS ENUM ('percentage', 'fixed_amount');
ALTER TABLE "public"."vouchers" ALTER COLUMN "discount_type" TYPE "public"."voucher_discount_type_enum_new" USING ("discount_type"::text::"public"."voucher_discount_type_enum_new");
ALTER TYPE "public"."voucher_discount_type_enum" RENAME TO "voucher_discount_type_enum_old";
ALTER TYPE "public"."voucher_discount_type_enum_new" RENAME TO "voucher_discount_type_enum";
DROP TYPE "public"."voucher_discount_type_enum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."affiliate_stats" DROP CONSTRAINT "affiliate_stats_affiliate_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."affiliate_stats" DROP CONSTRAINT "affiliate_stats_associated_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_parent_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversation_participants" DROP CONSTRAINT "conversation_participants_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversation_participants" DROP CONSTRAINT "conversation_participants_last_read_message_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversation_participants" DROP CONSTRAINT "conversation_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."conversations" DROP CONSTRAINT "conversations_last_message_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_following_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."logistics_order_items" DROP CONSTRAINT "logistics_order_items_inventory_item_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."logistics_order_items" DROP CONSTRAINT "logistics_order_items_logistics_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."logistics_orders" DROP CONSTRAINT "logistics_orders_from_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."logistics_orders" DROP CONSTRAINT "logistics_orders_to_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_menu_item_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_affiliate_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_billing_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_delivery_person_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_shipping_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_categories" DROP CONSTRAINT "post_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_categories" DROP CONSTRAINT "post_categories_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_categories" DROP CONSTRAINT "product_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_categories" DROP CONSTRAINT "product_categories_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_tags" DROP CONSTRAINT "product_tags_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_tags" DROP CONSTRAINT "product_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."restaurant_chains" DROP CONSTRAINT "restaurant_chains_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_assignments" DROP CONSTRAINT "task_assignments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_assignments" DROP CONSTRAINT "task_assignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."verification_email_logs" DROP CONSTRAINT "verification_email_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."verification_tokens" DROP CONSTRAINT "verification_tokens_user_id_fkey";

-- DropIndex
DROP INDEX "public"."idx_addresses_default_billing";

-- DropIndex
DROP INDEX "public"."idx_addresses_default_shipping";

-- DropIndex
DROP INDEX "public"."idx_categories_parent";

-- DropIndex
DROP INDEX "public"."idx_conversations_created";

-- DropIndex
DROP INDEX "public"."idx_conversations_creator";

-- DropIndex
DROP INDEX "public"."idx_order_items_created";

-- DropIndex
DROP INDEX "public"."idx_order_items_product";

-- DropIndex
DROP INDEX "public"."idx_restaurant_chains_owner";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "is_default_billing",
DROP COLUMN "is_default_shipping",
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "parent_category_id",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image_url" VARCHAR(255),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parent_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."conversations" DROP COLUMN "creator_id",
DROP COLUMN "last_message_id",
DROP COLUMN "name",
ADD COLUMN     "customer_id" UUID,
ADD COLUMN     "last_message_at" TIMESTAMPTZ(6),
ADD COLUMN     "restaurant_id" UUID,
ADD COLUMN     "staff_id" UUID,
ADD COLUMN     "status" "public"."conversation_status_enum" NOT NULL DEFAULT 'active',
ADD COLUMN     "title" VARCHAR(255),
ALTER COLUMN "type" SET DEFAULT 'support';

-- AlterTable
ALTER TABLE "public"."inventory_items" ADD COLUMN     "expiry_date" DATE,
ADD COLUMN     "supplier" VARCHAR(100),
ADD COLUMN     "unit_cost" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."inventory_transactions" DROP COLUMN "note",
ADD COLUMN     "invoice_number" VARCHAR(50),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "supplier" VARCHAR(100),
ADD COLUMN     "total_cost" DECIMAL(12,2),
ADD COLUMN     "unit_cost" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."menu_items" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "dietary_info" TEXT[],
ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preparation_time" INTEGER,
ALTER COLUMN "image_url" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."menus" ADD COLUMN     "display_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image_url" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."messages" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "price_at_purchase",
DROP COLUMN "product_id",
DROP COLUMN "product_name",
ADD COLUMN     "cooking_status" "public"."cooking_status_enum" NOT NULL DEFAULT 'pending',
ADD COLUMN     "prepared_at" TIMESTAMPTZ(6),
ADD COLUMN     "served_at" TIMESTAMPTZ(6),
ADD COLUMN     "special_instructions" TEXT,
ADD COLUMN     "total_price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "unit_price" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "menu_item_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "affiliate_user_id",
DROP COLUMN "billing_address_id",
DROP COLUMN "delivery_person_id",
DROP COLUMN "payment_method",
DROP COLUMN "shipping_address_id",
DROP COLUMN "shipping_fee",
DROP COLUMN "user_id",
ADD COLUMN     "address_id" UUID,
ADD COLUMN     "customer_id" UUID NOT NULL,
ADD COLUMN     "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "estimated_time" INTEGER,
ADD COLUMN     "order_type" "public"."order_type_enum" NOT NULL DEFAULT 'dine_in',
ADD COLUMN     "restaurant_id" UUID NOT NULL,
ADD COLUMN     "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."organizations" ADD COLUMN     "logo_url" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."recipe_ingredients" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."recipes" ADD COLUMN     "cook_time" INTEGER,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "prep_time" INTEGER,
ADD COLUMN     "serving_size" INTEGER;

-- AlterTable
ALTER TABLE "public"."restaurant_chains" DROP COLUMN "owner_id",
ADD COLUMN     "logo_url" VARCHAR(255),
ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."restaurant_staffs" ADD COLUMN     "hourly_rate" DECIMAL(10,2),
ALTER COLUMN "left_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "public"."restaurants" ADD COLUMN     "cover_url" VARCHAR(255),
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "logo_url" VARCHAR(255),
ADD COLUMN     "opening_hours" JSONB,
ADD COLUMN     "status" "public"."restaurant_status_enum" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "bio",
DROP COLUMN "cover_url",
DROP COLUMN "mfa_enabled",
DROP COLUMN "mfa_secret",
DROP COLUMN "password_hash",
ADD COLUMN     "clerk_id" VARCHAR(255),
ADD COLUMN     "date_of_birth" DATE,
ADD COLUMN     "gender" VARCHAR(10),
ADD COLUMN     "loyalty_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_orders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_spent" DECIMAL(14,2) NOT NULL DEFAULT 0,
ALTER COLUMN "role" SET DEFAULT 'customer',
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "public"."vouchers" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."affiliate_stats";

-- DropTable
DROP TABLE "public"."cart_items";

-- DropTable
DROP TABLE "public"."comments";

-- DropTable
DROP TABLE "public"."conversation_participants";

-- DropTable
DROP TABLE "public"."follows";

-- DropTable
DROP TABLE "public"."likes";

-- DropTable
DROP TABLE "public"."logistics_order_items";

-- DropTable
DROP TABLE "public"."logistics_orders";

-- DropTable
DROP TABLE "public"."notifications";

-- DropTable
DROP TABLE "public"."post_categories";

-- DropTable
DROP TABLE "public"."post_tags";

-- DropTable
DROP TABLE "public"."posts";

-- DropTable
DROP TABLE "public"."product_categories";

-- DropTable
DROP TABLE "public"."product_images";

-- DropTable
DROP TABLE "public"."product_tags";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."projects";

-- DropTable
DROP TABLE "public"."roles";

-- DropTable
DROP TABLE "public"."sessions";

-- DropTable
DROP TABLE "public"."tags";

-- DropTable
DROP TABLE "public"."task_assignments";

-- DropTable
DROP TABLE "public"."tasks";

-- DropTable
DROP TABLE "public"."user_roles";

-- DropTable
DROP TABLE "public"."verification_email_logs";

-- DropTable
DROP TABLE "public"."verification_tokens";

-- DropEnum
DROP TYPE "public"."affiliate_status_enum";

-- DropEnum
DROP TYPE "public"."logistics_order_status_enum";

-- DropEnum
DROP TYPE "public"."post_type_enum";

-- DropEnum
DROP TYPE "public"."task_priority_enum";

-- DropEnum
DROP TYPE "public"."task_status_enum";

-- DropEnum
DROP TYPE "public"."verification_token_type_enum";

-- DropEnum
DROP TYPE "public"."visibility_enum";

-- CreateTable
CREATE TABLE "public"."tables" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_number" VARCHAR(20) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "location" VARCHAR(50),
    "status" "public"."table_status_enum" NOT NULL DEFAULT 'available',
    "qr_code" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservations" (
    "id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "customer_id" UUID,
    "customer_name" VARCHAR(100) NOT NULL,
    "customer_phone" VARCHAR(20) NOT NULL,
    "customer_email" VARCHAR(255),
    "party_size" INTEGER NOT NULL,
    "reservation_date" TIMESTAMPTZ(6) NOT NULL,
    "duration_hours" DECIMAL(4,2) NOT NULL DEFAULT 2,
    "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'pending',
    "special_requests" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."table_orders" (
    "id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "order_id" UUID,
    "session_code" VARCHAR(20) NOT NULL,
    "status" "public"."table_order_status_enum" NOT NULL DEFAULT 'active',
    "opened_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),
    "total_amount" DECIMAL(14,2),
    "staff_id" UUID,

    CONSTRAINT "table_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "method" "public"."payment_method_enum" NOT NULL,
    "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(50),
    "transaction_id" VARCHAR(255),
    "gateway_response" JSONB,
    "processed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff_schedules" (
    "id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "shift_date" DATE NOT NULL,
    "shift_type" "public"."staff_shift_type_enum" NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "status" "public"."staff_schedule_status_enum" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff_attendance" (
    "id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "schedule_id" UUID,
    "work_date" DATE NOT NULL,
    "check_in_time" TIMESTAMPTZ(6),
    "check_out_time" TIMESTAMPTZ(6),
    "break_duration" INTEGER,
    "overtime_hours" DECIMAL(4,2),
    "total_hours" DECIMAL(4,2),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."promotions" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "type" "public"."promotion_type_enum" NOT NULL,
    "discount_value" DECIMAL(12,2) NOT NULL,
    "conditions" JSONB,
    "applicable_items" TEXT[],
    "time_restrictions" JSONB,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "restaurant_id" UUID,
    "order_id" UUID,
    "menu_item_id" UUID,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "photos" TEXT[],
    "status" "public"."review_status_enum" NOT NULL DEFAULT 'active',
    "response" TEXT,
    "responded_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."revenue_reports" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "report_date" DATE NOT NULL,
    "report_type" "public"."revenue_report_type_enum" NOT NULL,
    "total_revenue" DECIMAL(14,2) NOT NULL,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_customers" INTEGER NOT NULL DEFAULT 0,
    "avg_order_value" DECIMAL(12,2),
    "dine_in_revenue" DECIMAL(14,2),
    "takeaway_revenue" DECIMAL(14,2),
    "delivery_revenue" DECIMAL(14,2),
    "popular_items" JSONB,
    "payment_methods_breakdown" JSONB,
    "hourly_breakdown" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_statistics" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "total_reservations" INTEGER NOT NULL DEFAULT 0,
    "successful_reservations" INTEGER NOT NULL DEFAULT 0,
    "cancelled_reservations" INTEGER NOT NULL DEFAULT 0,
    "no_show_reservations" INTEGER NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "completed_orders" INTEGER NOT NULL DEFAULT 0,
    "cancelled_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "favorite_restaurant_id" UUID,
    "last_order_date" TIMESTAMPTZ(6),
    "last_reservation_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tables_qr_code_key" ON "public"."tables"("qr_code");

-- CreateIndex
CREATE INDEX "idx_tables_restaurant" ON "public"."tables"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_tables_status" ON "public"."tables"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tables_restaurant_id_table_number_key" ON "public"."tables"("restaurant_id", "table_number");

-- CreateIndex
CREATE INDEX "idx_reservations_table" ON "public"."reservations"("table_id");

-- CreateIndex
CREATE INDEX "idx_reservations_customer" ON "public"."reservations"("customer_id");

-- CreateIndex
CREATE INDEX "idx_reservations_date" ON "public"."reservations"("reservation_date");

-- CreateIndex
CREATE INDEX "idx_reservations_status" ON "public"."reservations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "table_orders_session_code_key" ON "public"."table_orders"("session_code");

-- CreateIndex
CREATE INDEX "idx_table_orders_table" ON "public"."table_orders"("table_id");

-- CreateIndex
CREATE INDEX "idx_table_orders_session" ON "public"."table_orders"("session_code");

-- CreateIndex
CREATE INDEX "idx_table_orders_status" ON "public"."table_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "public"."payments"("transaction_id");

-- CreateIndex
CREATE INDEX "idx_payments_order" ON "public"."payments"("order_id");

-- CreateIndex
CREATE INDEX "idx_payments_status" ON "public"."payments"("status");

-- CreateIndex
CREATE INDEX "idx_payments_method" ON "public"."payments"("method");

-- CreateIndex
CREATE INDEX "idx_payments_transaction" ON "public"."payments"("transaction_id");

-- CreateIndex
CREATE INDEX "idx_staff_schedules_restaurant" ON "public"."staff_schedules"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_staff_schedules_date" ON "public"."staff_schedules"("shift_date");

-- CreateIndex
CREATE INDEX "idx_staff_schedules_status" ON "public"."staff_schedules"("status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_schedules_staff_id_shift_date_shift_type_key" ON "public"."staff_schedules"("staff_id", "shift_date", "shift_type");

-- CreateIndex
CREATE INDEX "idx_staff_attendance_restaurant" ON "public"."staff_attendance"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_staff_attendance_date" ON "public"."staff_attendance"("work_date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_staff_id_work_date_key" ON "public"."staff_attendance"("staff_id", "work_date");

-- CreateIndex
CREATE INDEX "idx_promotions_restaurant" ON "public"."promotions"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_promotions_dates" ON "public"."promotions"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_promotions_active" ON "public"."promotions"("is_active");

-- CreateIndex
CREATE INDEX "idx_reviews_customer" ON "public"."reviews"("customer_id");

-- CreateIndex
CREATE INDEX "idx_reviews_restaurant" ON "public"."reviews"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_reviews_rating" ON "public"."reviews"("rating");

-- CreateIndex
CREATE INDEX "idx_reviews_status" ON "public"."reviews"("status");

-- CreateIndex
CREATE INDEX "idx_reviews_created" ON "public"."reviews"("created_at");

-- CreateIndex
CREATE INDEX "idx_revenue_reports_restaurant" ON "public"."revenue_reports"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_revenue_reports_date" ON "public"."revenue_reports"("report_date");

-- CreateIndex
CREATE INDEX "idx_revenue_reports_type" ON "public"."revenue_reports"("report_type");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_reports_restaurant_id_report_date_report_type_key" ON "public"."revenue_reports"("restaurant_id", "report_date", "report_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_user_id_key" ON "public"."user_statistics"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_statistics_user" ON "public"."user_statistics"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_statistics_orders" ON "public"."user_statistics"("total_orders");

-- CreateIndex
CREATE INDEX "idx_user_statistics_spent" ON "public"."user_statistics"("total_spent");

-- CreateIndex
CREATE INDEX "idx_addresses_default" ON "public"."addresses"("is_default");

-- CreateIndex
CREATE INDEX "idx_categories_parent" ON "public"."categories"("parent_id");

-- CreateIndex
CREATE INDEX "idx_categories_active" ON "public"."categories"("is_active");

-- CreateIndex
CREATE INDEX "idx_conversations_restaurant" ON "public"."conversations"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_conversations_customer" ON "public"."conversations"("customer_id");

-- CreateIndex
CREATE INDEX "idx_conversations_staff" ON "public"."conversations"("staff_id");

-- CreateIndex
CREATE INDEX "idx_conversations_status" ON "public"."conversations"("status");

-- CreateIndex
CREATE INDEX "idx_inventory_items_quantity" ON "public"."inventory_items"("quantity");

-- CreateIndex
CREATE INDEX "idx_inventory_items_expiry" ON "public"."inventory_items"("expiry_date");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_type" ON "public"."inventory_transactions"("type");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_created" ON "public"."inventory_transactions"("created_at");

-- CreateIndex
CREATE INDEX "idx_menu_items_available" ON "public"."menu_items"("is_available");

-- CreateIndex
CREATE INDEX "idx_menu_items_featured" ON "public"."menu_items"("is_featured");

-- CreateIndex
CREATE INDEX "idx_menu_items_price" ON "public"."menu_items"("price");

-- CreateIndex
CREATE INDEX "idx_menus_active" ON "public"."menus"("is_active");

-- CreateIndex
CREATE INDEX "idx_order_items_menu_item" ON "public"."order_items"("menu_item_id");

-- CreateIndex
CREATE INDEX "idx_order_items_cooking_status" ON "public"."order_items"("cooking_status");

-- CreateIndex
CREATE INDEX "idx_orders_restaurant" ON "public"."orders"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_orders_customer" ON "public"."orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_type" ON "public"."orders"("order_type");

-- CreateIndex
CREATE INDEX "idx_orders_created" ON "public"."orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_organizations_code" ON "public"."organizations"("code");

-- CreateIndex
CREATE INDEX "idx_restaurant_chains_organization" ON "public"."restaurant_chains"("organization_id");

-- CreateIndex
CREATE INDEX "idx_restaurant_staff_status" ON "public"."restaurant_staffs"("status");

-- CreateIndex
CREATE INDEX "idx_restaurants_status" ON "public"."restaurants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "public"."users"("clerk_id");

-- CreateIndex
CREATE INDEX "idx_users_clerk" ON "public"."users"("clerk_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "idx_users_phone" ON "public"."users"("phone_number");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "idx_users_status" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "idx_users_total_orders" ON "public"."users"("total_orders");

-- CreateIndex
CREATE INDEX "idx_voucher_usages_used" ON "public"."voucher_usages"("used_at");

-- CreateIndex
CREATE INDEX "idx_vouchers_code" ON "public"."vouchers"("code");

-- CreateIndex
CREATE INDEX "idx_vouchers_active" ON "public"."vouchers"("is_active");

-- CreateIndex
CREATE INDEX "idx_vouchers_dates" ON "public"."vouchers"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_chains" ADD CONSTRAINT "restaurant_chains_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tables" ADD CONSTRAINT "tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_schedules" ADD CONSTRAINT "staff_schedules_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_schedules" ADD CONSTRAINT "staff_schedules_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."staff_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promotions" ADD CONSTRAINT "promotions_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revenue_reports" ADD CONSTRAINT "revenue_reports_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_statistics" ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
