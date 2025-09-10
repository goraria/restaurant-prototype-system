-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."user_status_enum" AS ENUM ('active', 'inactive', 'banned', 'suspended', 'pending_verification', 'locked', 'on_leave');

-- CreateEnum
CREATE TYPE "public"."user_activity_status_enum" AS ENUM ('available', 'busy', 'do_not_disturb', 'away', 'offline', 'invisible');

-- CreateEnum
CREATE TYPE "public"."user_role_enum" AS ENUM ('customer', 'staff', 'manager', 'admin', 'super_admin', 'deliver');

-- CreateEnum
CREATE TYPE "public"."organization_role_enum" AS ENUM ('admin', 'member', 'guest');

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
CREATE TYPE "public"."order_status_enum" AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."cooking_status_enum" AS ENUM ('pending', 'preparing', 'cooking', 'ready', 'served', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."payment_method_enum" AS ENUM ('cash', 'card', 'bank_transfer', 'momo', 'zalopay', 'viettelpay', 'vnpay', 'shopeepay', 'paypal');

-- CreateEnum
CREATE TYPE "public"."payment_status_enum" AS ENUM ('pending', 'completed', 'failed', 'processing', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "public"."restaurant_staff_role_enum" AS ENUM ('staff', 'manager', 'chef', 'cashier', 'security', 'cleaner', 'supervisor', 'sous_chef', 'waiter', 'host');

-- CreateEnum
CREATE TYPE "public"."staff_status_enum" AS ENUM ('active', 'inactive', 'on_leave', 'suspended', 'terminated');

-- CreateEnum
CREATE TYPE "public"."staff_shift_type_enum" AS ENUM ('morning', 'afternoon', 'evening', 'night', 'full_day', 'split_shift');

-- CreateEnum
CREATE TYPE "public"."staff_schedule_status_enum" AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'absent', 'late', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."inventory_transaction_type_enum" AS ENUM ('purchase', 'usage', 'adjustment', 'waste', 'return', 'transfer');

-- CreateEnum
CREATE TYPE "public"."voucher_discount_type_enum" AS ENUM ('percentage', 'fixed_amount');

-- CreateEnum
CREATE TYPE "public"."promotion_type_enum" AS ENUM ('percentage', 'fixed_amount', 'buy_one_get_one', 'combo_deal', 'happy_hour', 'seasonal');

-- CreateEnum
CREATE TYPE "public"."review_status_enum" AS ENUM ('active', 'hidden', 'flagged', 'deleted');

-- CreateEnum
CREATE TYPE "public"."revenue_report_type_enum" AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."conversation_type_enum" AS ENUM ('support', 'feedback', 'complaint', 'inquiry');

-- CreateEnum
CREATE TYPE "public"."conversation_status_enum" AS ENUM ('active', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "public"."message_type_enum" AS ENUM ('text', 'image', 'file', 'system');

-- CreateEnum
CREATE TYPE "public"."notification_type_enum" AS ENUM ('order_created', 'order_confirmed', 'order_preparing', 'order_ready', 'order_delivered', 'order_cancelled', 'order_payment_success', 'order_payment_failed', 'reservation_created', 'reservation_confirmed', 'reservation_cancelled', 'reservation_reminder', 'shift_assigned', 'shift_reminder', 'schedule_updated', 'attendance_reminder', 'new_review', 'low_inventory', 'menu_updated', 'promotion_created', 'voucher_expires_soon', 'member_joined', 'member_left', 'role_changed', 'organization_updated', 'system_maintenance', 'feature_announcement', 'security_alert', 'new_message', 'conversation_started');

-- CreateEnum
CREATE TYPE "public"."notification_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."notification_status_enum" AS ENUM ('unread', 'read', 'archived');

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "recipient_name" VARCHAR(100) NOT NULL,
    "recipient_phone" VARCHAR(20) NOT NULL,
    "street_address" VARCHAR(255) NOT NULL,
    "ward" VARCHAR(100),
    "district" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" UUID NOT NULL,
    "type" "public"."conversation_type_enum" NOT NULL DEFAULT 'support',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" UUID,
    "last_message_at" TIMESTAMPTZ(6),
    "restaurant_id" UUID,
    "staff_id" UUID,
    "status" "public"."conversation_status_enum" NOT NULL DEFAULT 'active',
    "title" VARCHAR(255),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" "public"."message_type_enum" NOT NULL DEFAULT 'text',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" TEXT[],
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "logo_url" VARCHAR(255),
    "clerk_id" VARCHAR(255),
    "clerk_slug" VARCHAR(255),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."restaurant_chains" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo_url" VARCHAR(255),
    "organization_id" UUID NOT NULL,

    CONSTRAINT "restaurant_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurants" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "chain_id" UUID,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manager_id" UUID,
    "cover_url" VARCHAR(255),
    "email" VARCHAR(255),
    "logo_url" VARCHAR(255),
    "opening_hours" JSONB,
    "status" "public"."restaurant_status_enum" NOT NULL DEFAULT 'active',

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menus" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" VARCHAR(255),

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "image_url" VARCHAR(255),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID,
    "allergens" TEXT[],
    "calories" INTEGER,
    "dietary_info" TEXT[],
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "preparation_time" INTEGER,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "public"."orders" (
    "id" UUID NOT NULL,
    "order_code" VARCHAR(20) NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(14,2) NOT NULL,
    "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending',
    "payment_status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address_id" UUID,
    "customer_id" UUID NOT NULL,
    "delivery_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estimated_time" INTEGER,
    "order_type" "public"."order_type_enum" NOT NULL DEFAULT 'dine_in',
    "restaurant_id" UUID NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menu_item_id" UUID NOT NULL,
    "cooking_status" "public"."cooking_status_enum" NOT NULL DEFAULT 'pending',
    "prepared_at" TIMESTAMPTZ(6),
    "served_at" TIMESTAMPTZ(6),
    "special_instructions" TEXT,
    "total_price" DECIMAL(12,2) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_status_history" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "status" "public"."order_status_enum" NOT NULL,
    "changed_by_user_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."restaurant_staffs" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."restaurant_staff_role_enum" NOT NULL,
    "status" "public"."staff_status_enum" NOT NULL DEFAULT 'active',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ(6),
    "hourly_rate" DECIMAL(10,2),

    CONSTRAINT "restaurant_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff_schedules" (
    "id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "shift_date" DATE NOT NULL,
    "shift_type" "public"."staff_shift_type_enum" NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
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
CREATE TABLE "public"."inventory_items" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(20) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "min_quantity" DECIMAL(12,2),
    "max_quantity" DECIMAL(12,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" DATE,
    "supplier" VARCHAR(100),
    "unit_cost" DECIMAL(10,2),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_transactions" (
    "id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "type" "public"."inventory_transaction_type_enum" NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_number" VARCHAR(50),
    "notes" TEXT,
    "supplier" VARCHAR(100),
    "total_cost" DECIMAL(12,2),
    "unit_cost" DECIMAL(10,2),

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipes" (
    "id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cook_time" INTEGER,
    "instructions" TEXT,
    "prep_time" INTEGER,
    "serving_size" INTEGER,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_ingredients" (
    "id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vouchers" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "discount_type" "public"."voucher_discount_type_enum" NOT NULL,
    "discount_value" DECIMAL(12,2) NOT NULL,
    "min_order_value" DECIMAL(12,2),
    "max_discount" DECIMAL(12,2),
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "usage_limit" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "restaurant_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."voucher_usages" (
    "id" UUID NOT NULL,
    "voucher_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "order_id" UUID,
    "used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_usages_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "full_name" VARCHAR(200),
    "phone_code" VARCHAR(8),
    "phone_number" VARCHAR(20),
    "avatar_url" VARCHAR(255),
    "email_verified_at" TIMESTAMPTZ(6),
    "phone_verified_at" TIMESTAMPTZ(6),
    "status" "public"."user_status_enum" NOT NULL DEFAULT 'active',
    "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "clerk_id" VARCHAR(255),
    "date_of_birth" DATE,
    "gender" VARCHAR(10),
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "password_hash" VARCHAR(255),
    "activity_status" "public"."user_activity_status_enum" NOT NULL DEFAULT 'available',
    "is_online" BOOLEAN DEFAULT false,
    "last_activity_at" TIMESTAMPTZ(6),
    "last_seen_at" TIMESTAMPTZ(6),
    "has_image" BOOLEAN DEFAULT false,
    "primary_email_address_id" VARCHAR(255),
    "password_enabled" BOOLEAN DEFAULT false,
    "two_factor_enabled" BOOLEAN DEFAULT false,
    "totp_enabled" BOOLEAN DEFAULT false,
    "backup_code_enabled" BOOLEAN DEFAULT false,
    "banned" BOOLEAN DEFAULT false,
    "locked" BOOLEAN DEFAULT false,
    "lockout_expires_in_seconds" INTEGER,
    "delete_self_enabled" BOOLEAN DEFAULT true,
    "create_organization_enabled" BOOLEAN DEFAULT false,
    "create_organizations_limit" INTEGER,
    "legal_accepted_at" TIMESTAMPTZ(6),
    "last_sign_in_at" TIMESTAMPTZ(6),
    "public_metadata" JSONB,
    "private_metadata" JSONB,
    "unsafe_metadata" JSONB,
    "email_addresses" JSONB,
    "phone_numbers" JSONB,
    "web3_wallets" JSONB,
    "external_accounts" JSONB,
    "enterprise_accounts" JSONB,
    "passkeys" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."notification_type_enum" NOT NULL,
    "priority" "public"."notification_priority_enum" NOT NULL DEFAULT 'medium',
    "status" "public"."notification_status_enum" NOT NULL DEFAULT 'unread',
    "user_id" UUID NOT NULL,
    "related_id" UUID,
    "related_type" VARCHAR(50),
    "action_url" VARCHAR(500),
    "metadata" JSONB,
    "read_at" TIMESTAMPTZ(6),
    "scheduled_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_addresses_user" ON "public"."addresses"("user_id");

-- CreateIndex
CREATE INDEX "idx_addresses_default" ON "public"."addresses"("is_default");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "idx_categories_parent" ON "public"."categories"("parent_id");

-- CreateIndex
CREATE INDEX "idx_categories_slug" ON "public"."categories"("slug");

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
CREATE INDEX "idx_messages_conversation" ON "public"."messages"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_messages_sender" ON "public"."messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_messages_created" ON "public"."messages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "public"."organizations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_id_key" ON "public"."organizations"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_slug_key" ON "public"."organizations"("clerk_slug");

-- CreateIndex
CREATE INDEX "idx_organizations_owner" ON "public"."organizations"("owner_id");

-- CreateIndex
CREATE INDEX "idx_organizations_code" ON "public"."organizations"("code");

-- CreateIndex
CREATE INDEX "idx_organizations_clerk" ON "public"."organizations"("clerk_id");

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
CREATE INDEX "idx_restaurant_chains_organization" ON "public"."restaurant_chains"("organization_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_organization" ON "public"."restaurants"("organization_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_chain" ON "public"."restaurants"("chain_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_manager" ON "public"."restaurants"("manager_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_status" ON "public"."restaurants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_restaurant_org_code" ON "public"."restaurants"("organization_id", "code");

-- CreateIndex
CREATE INDEX "idx_menus_restaurant" ON "public"."menus"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_menus_active" ON "public"."menus"("is_active");

-- CreateIndex
CREATE INDEX "idx_menu_items_menu" ON "public"."menu_items"("menu_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_category" ON "public"."menu_items"("category_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_available" ON "public"."menu_items"("is_available");

-- CreateIndex
CREATE INDEX "idx_menu_items_featured" ON "public"."menu_items"("is_featured");

-- CreateIndex
CREATE INDEX "idx_menu_items_price" ON "public"."menu_items"("price");

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
CREATE UNIQUE INDEX "orders_order_code_key" ON "public"."orders"("order_code");

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
CREATE INDEX "idx_order_items_order" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_menu_item" ON "public"."order_items"("menu_item_id");

-- CreateIndex
CREATE INDEX "idx_order_items_cooking_status" ON "public"."order_items"("cooking_status");

-- CreateIndex
CREATE INDEX "idx_order_status_history_order" ON "public"."order_status_history"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_status_history_created" ON "public"."order_status_history"("created_at");

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
CREATE INDEX "idx_restaurant_staff_user" ON "public"."restaurant_staffs"("user_id");

-- CreateIndex
CREATE INDEX "idx_restaurant_staff_role" ON "public"."restaurant_staffs"("role");

-- CreateIndex
CREATE INDEX "idx_restaurant_staff_status" ON "public"."restaurant_staffs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_restaurant_staff" ON "public"."restaurant_staffs"("restaurant_id", "user_id");

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
CREATE INDEX "idx_inventory_items_restaurant" ON "public"."inventory_items"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_inventory_items_quantity" ON "public"."inventory_items"("quantity");

-- CreateIndex
CREATE INDEX "idx_inventory_items_expiry" ON "public"."inventory_items"("expiry_date");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_item" ON "public"."inventory_transactions"("inventory_item_id");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_type" ON "public"."inventory_transactions"("type");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_created" ON "public"."inventory_transactions"("created_at");

-- CreateIndex
CREATE INDEX "idx_recipes_menu_item" ON "public"."recipes"("menu_item_id");

-- CreateIndex
CREATE INDEX "idx_recipe_ingredients_recipe" ON "public"."recipe_ingredients"("recipe_id");

-- CreateIndex
CREATE INDEX "idx_recipe_ingredients_item" ON "public"."recipe_ingredients"("inventory_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "public"."vouchers"("code");

-- CreateIndex
CREATE INDEX "idx_vouchers_restaurant" ON "public"."vouchers"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_vouchers_code" ON "public"."vouchers"("code");

-- CreateIndex
CREATE INDEX "idx_vouchers_active" ON "public"."vouchers"("is_active");

-- CreateIndex
CREATE INDEX "idx_vouchers_dates" ON "public"."vouchers"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_voucher_usages_voucher" ON "public"."voucher_usages"("voucher_id");

-- CreateIndex
CREATE INDEX "idx_voucher_usages_user" ON "public"."voucher_usages"("user_id");

-- CreateIndex
CREATE INDEX "idx_voucher_usages_used" ON "public"."voucher_usages"("used_at");

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
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

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
CREATE INDEX "idx_users_online" ON "public"."users"("is_online");

-- CreateIndex
CREATE INDEX "idx_users_activity_status" ON "public"."users"("activity_status");

-- CreateIndex
CREATE INDEX "idx_users_last_seen" ON "public"."users"("last_seen_at");

-- CreateIndex
CREATE INDEX "idx_users_last_activity" ON "public"."users"("last_activity_at");

-- CreateIndex
CREATE INDEX "idx_users_username" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "idx_users_banned" ON "public"."users"("banned");

-- CreateIndex
CREATE INDEX "idx_users_locked" ON "public"."users"("locked");

-- CreateIndex
CREATE INDEX "idx_users_last_sign_in" ON "public"."users"("last_sign_in_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_user_id_key" ON "public"."user_statistics"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_statistics_user" ON "public"."user_statistics"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_statistics_orders" ON "public"."user_statistics"("total_orders");

-- CreateIndex
CREATE INDEX "idx_user_statistics_spent" ON "public"."user_statistics"("total_spent");

-- CreateIndex
CREATE INDEX "idx_notifications_user" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_notifications_status" ON "public"."notifications"("status");

-- CreateIndex
CREATE INDEX "idx_notifications_type" ON "public"."notifications"("type");

-- CreateIndex
CREATE INDEX "idx_notifications_priority" ON "public"."notifications"("priority");

-- CreateIndex
CREATE INDEX "idx_notifications_created" ON "public"."notifications"("created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_expires" ON "public"."notifications"("expires_at");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_chains" ADD CONSTRAINT "restaurant_chains_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "public"."restaurant_chains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tables" ADD CONSTRAINT "tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."table_orders" ADD CONSTRAINT "table_orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_staffs" ADD CONSTRAINT "restaurant_staffs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_staffs" ADD CONSTRAINT "restaurant_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_schedules" ADD CONSTRAINT "staff_schedules_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_schedules" ADD CONSTRAINT "staff_schedules_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."staff_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."staff_attendance" ADD CONSTRAINT "staff_attendance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vouchers" ADD CONSTRAINT "vouchers_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promotions" ADD CONSTRAINT "promotions_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revenue_reports" ADD CONSTRAINT "revenue_reports_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_statistics" ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

