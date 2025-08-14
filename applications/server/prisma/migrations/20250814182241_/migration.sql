-- CreateEnum
CREATE TYPE "public"."restaurant_staff_role_enum" AS ENUM ('staff', 'manager', 'chef', 'cashier', 'security', 'cleaner');

-- CreateEnum
CREATE TYPE "public"."staff_status_enum" AS ENUM ('active', 'inactive', 'suspended', 'left');

-- CreateEnum
CREATE TYPE "public"."affiliate_status_enum" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."conversation_type_enum" AS ENUM ('private', 'group');

-- CreateEnum
CREATE TYPE "public"."message_type_enum" AS ENUM ('text', 'image', 'video', 'file');

-- CreateEnum
CREATE TYPE "public"."order_status_enum" AS ENUM ('pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."payment_status_enum" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."post_type_enum" AS ENUM ('social', 'blog');

-- CreateEnum
CREATE TYPE "public"."task_priority_enum" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."verification_token_type_enum" AS ENUM ('email_verification', 'phone_verification', 'mfa_challenge', 'password_reset');

-- CreateEnum
CREATE TYPE "public"."task_status_enum" AS ENUM ('to_do', 'in_progress', 'completed', 'on_hold', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."user_role_enum" AS ENUM ('user', 'admin', 'moderator');

-- CreateEnum
CREATE TYPE "public"."user_status_enum" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "public"."visibility_enum" AS ENUM ('public', 'followers', 'private');

-- CreateEnum
CREATE TYPE "public"."inventory_transaction_type_enum" AS ENUM ('import', 'export', 'adjust');

-- CreateEnum
CREATE TYPE "public"."voucher_discount_type_enum" AS ENUM ('percent', 'fixed');

-- CreateEnum
CREATE TYPE "public"."logistics_order_status_enum" AS ENUM ('pending', 'in_transit', 'completed', 'cancelled');

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
    "is_default_shipping" BOOLEAN NOT NULL DEFAULT false,
    "is_default_billing" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."affiliate_stats" (
    "id" UUID NOT NULL,
    "affiliate_user_id" UUID NOT NULL,
    "associated_order_id" UUID,
    "commission_amount" DECIMAL(10,2),
    "click_source" VARCHAR(255),
    "ip_address" VARCHAR(45),
    "status" "public"."affiliate_status_enum" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cart_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" UUID NOT NULL,
    "parent_category_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID NOT NULL,
    "parent_comment_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation_participants" (
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "last_read_message_id" UUID,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "type" "public"."conversation_type_enum" NOT NULL DEFAULT 'private',
    "creator_id" UUID,
    "last_message_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follows" (
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" "public"."message_type_enum" NOT NULL DEFAULT 'text',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "actor_id" UUID,
    "action_type" VARCHAR(50) NOT NULL,
    "target_id" UUID,
    "content" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" DECIMAL(12,2) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menu_item_id" UUID,

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
CREATE TABLE "public"."orders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "order_code" VARCHAR(20) NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(14,2) NOT NULL,
    "shipping_address_id" UUID,
    "billing_address_id" UUID,
    "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending',
    "payment_method" VARCHAR(50),
    "payment_status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending',
    "delivery_person_id" UUID,
    "notes" TEXT,
    "affiliate_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_categories" (
    "post_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("post_id","category_id")
);

-- CreateTable
CREATE TABLE "public"."post_tags" (
    "post_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "post_type" "public"."post_type_enum" NOT NULL DEFAULT 'social',
    "title" VARCHAR(255),
    "content" TEXT NOT NULL,
    "media_url" TEXT,
    "visibility" "public"."visibility_enum" NOT NULL DEFAULT 'public',
    "allow_comments" BOOLEAN NOT NULL DEFAULT true,
    "slug" VARCHAR(255),
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_categories" (
    "product_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" VARCHAR(255),
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_tags" (
    "product_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sku" VARCHAR(100),
    "price" DECIMAL(12,2) NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "thumbnail_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurant_chains" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "restaurant_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "image_url" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurant_staffs" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."restaurant_staff_role_enum" NOT NULL,
    "status" "public"."staff_status_enum" NOT NULL DEFAULT 'active',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),

    CONSTRAINT "restaurant_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(60) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_assignments" (
    "task_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("task_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "assignee_id" UUID,
    "project_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "public"."task_status_enum" NOT NULL DEFAULT 'to_do',
    "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium',
    "due_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "phone_code" VARCHAR(8),
    "phone_number" VARCHAR(20),
    "avatar_url" VARCHAR(255),
    "cover_url" VARCHAR(255),
    "email_verified_at" TIMESTAMPTZ(6),
    "phone_verified_at" TIMESTAMPTZ(6),
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" VARCHAR(64),
    "bio" TEXT,
    "status" "public"."user_status_enum" NOT NULL DEFAULT 'active',
    "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "type" "public"."verification_token_type_enum" NOT NULL,
    "context" VARCHAR(50),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_email_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "email" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(255),
    "status" VARCHAR(30) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_email_logs_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_transactions" (
    "id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "type" "public"."inventory_transaction_type_enum" NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_ingredients" (
    "id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,

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
CREATE TABLE "public"."logistics_orders" (
    "id" UUID NOT NULL,
    "from_restaurant_id" UUID NOT NULL,
    "to_restaurant_id" UUID NOT NULL,
    "status" "public"."logistics_order_status_enum" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logistics_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logistics_order_items" (
    "id" UUID NOT NULL,
    "logistics_order_id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "logistics_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT,
    "refresh_token_hash" TEXT,
    "revoked_at" TIMESTAMPTZ(6),
    "replaced_by_session_id" UUID,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(255),
    "last_accessed_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_addresses_user" ON "public"."addresses"("user_id");

-- CreateIndex
CREATE INDEX "idx_addresses_default_shipping" ON "public"."addresses"("is_default_shipping");

-- CreateIndex
CREATE INDEX "idx_addresses_default_billing" ON "public"."addresses"("is_default_billing");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_stats_associated_order_id_key" ON "public"."affiliate_stats"("associated_order_id");

-- CreateIndex
CREATE INDEX "idx_affiliate_stats_user" ON "public"."affiliate_stats"("affiliate_user_id");

-- CreateIndex
CREATE INDEX "idx_affiliate_stats_created" ON "public"."affiliate_stats"("created_at");

-- CreateIndex
CREATE INDEX "idx_cart_items_user" ON "public"."cart_items"("user_id");

-- CreateIndex
CREATE INDEX "idx_cart_items_added" ON "public"."cart_items"("added_at");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_user_id_product_id_key" ON "public"."cart_items"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "idx_categories_parent" ON "public"."categories"("parent_category_id");

-- CreateIndex
CREATE INDEX "idx_categories_slug" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "idx_comments_parent" ON "public"."comments"("parent_id");

-- CreateIndex
CREATE INDEX "idx_comments_parent_comment" ON "public"."comments"("parent_comment_id");

-- CreateIndex
CREATE INDEX "idx_comments_user" ON "public"."comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_comments_created" ON "public"."comments"("created_at");

-- CreateIndex
CREATE INDEX "idx_conversation_participants_last_read" ON "public"."conversation_participants"("last_read_message_id");

-- CreateIndex
CREATE INDEX "idx_conversation_participants_user" ON "public"."conversation_participants"("user_id");

-- CreateIndex
CREATE INDEX "idx_conversation_participants_joined" ON "public"."conversation_participants"("joined_at");

-- CreateIndex
CREATE INDEX "idx_conversations_creator" ON "public"."conversations"("creator_id");

-- CreateIndex
CREATE INDEX "idx_conversations_created" ON "public"."conversations"("created_at");

-- CreateIndex
CREATE INDEX "idx_follows_following" ON "public"."follows"("following_id");

-- CreateIndex
CREATE INDEX "idx_follows_created" ON "public"."follows"("created_at");

-- CreateIndex
CREATE INDEX "idx_likes_target" ON "public"."likes"("target_id");

-- CreateIndex
CREATE INDEX "idx_likes_user" ON "public"."likes"("user_id");

-- CreateIndex
CREATE INDEX "idx_likes_created" ON "public"."likes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_target_id_key" ON "public"."likes"("user_id", "target_id");

-- CreateIndex
CREATE INDEX "idx_messages_conversation" ON "public"."messages"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_messages_sender" ON "public"."messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_messages_created" ON "public"."messages"("created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_actor" ON "public"."notifications"("actor_id");

-- CreateIndex
CREATE INDEX "idx_notifications_recipient_read_created" ON "public"."notifications"("recipient_id", "is_read", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_notifications_target" ON "public"."notifications"("target_id");

-- CreateIndex
CREATE INDEX "idx_notifications_created" ON "public"."notifications"("created_at");

-- CreateIndex
CREATE INDEX "idx_order_items_order" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product" ON "public"."order_items"("product_id");

-- CreateIndex
CREATE INDEX "idx_order_items_created" ON "public"."order_items"("created_at");

-- CreateIndex
CREATE INDEX "idx_order_status_history_order" ON "public"."order_status_history"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_status_history_created" ON "public"."order_status_history"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "public"."orders"("order_code");

-- CreateIndex
CREATE INDEX "post_categories_category_id_idx" ON "public"."post_categories"("category_id");

-- CreateIndex
CREATE INDEX "post_tags_tag_id_idx" ON "public"."post_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "public"."posts"("slug");

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "public"."posts"("author_id");

-- CreateIndex
CREATE INDEX "product_categories_category_id_idx" ON "public"."product_categories"("category_id");

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "public"."product_images"("product_id");

-- CreateIndex
CREATE INDEX "product_tags_tag_id_idx" ON "public"."product_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "public"."products"("name");

-- CreateIndex
CREATE INDEX "products_seller_id_idx" ON "public"."products"("seller_id");

-- CreateIndex
CREATE INDEX "idx_projects_owner_id" ON "public"."projects"("owner_id");

-- CreateIndex
CREATE INDEX "idx_restaurant_chains_owner" ON "public"."restaurant_chains"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "public"."organizations"("code");

-- CreateIndex
CREATE INDEX "idx_organizations_owner" ON "public"."organizations"("owner_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_organization" ON "public"."restaurants"("organization_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_chain" ON "public"."restaurants"("chain_id");

-- CreateIndex
CREATE INDEX "idx_restaurants_manager" ON "public"."restaurants"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_restaurant_org_code" ON "public"."restaurants"("organization_id", "code");

-- CreateIndex
CREATE INDEX "idx_menus_restaurant" ON "public"."menus"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_menu" ON "public"."menu_items"("menu_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_category" ON "public"."menu_items"("category_id");

-- CreateIndex
CREATE INDEX "idx_restaurant_staff_user" ON "public"."restaurant_staffs"("user_id");

-- CreateIndex
CREATE INDEX "idx_restaurant_staff_role" ON "public"."restaurant_staffs"("role");

-- CreateIndex
CREATE UNIQUE INDEX "uq_restaurant_staff" ON "public"."restaurant_staffs"("restaurant_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "idx_task_assignments_user_id" ON "public"."task_assignments"("user_id");

-- CreateIndex
CREATE INDEX "idx_tasks_assignee_id" ON "public"."tasks"("assignee_id");

-- CreateIndex
CREATE INDEX "idx_tasks_creator_id" ON "public"."tasks"("creator_id");

-- CreateIndex
CREATE INDEX "idx_tasks_project_id" ON "public"."tasks"("project_id");

-- CreateIndex
CREATE INDEX "idx_user_roles_role_id" ON "public"."user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "idx_verification_tokens_user" ON "public"."verification_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_verification_tokens_type" ON "public"."verification_tokens"("type");

-- CreateIndex
CREATE INDEX "idx_verif_email_logs_email" ON "public"."verification_email_logs"("email");

-- CreateIndex
CREATE INDEX "idx_verif_email_logs_created" ON "public"."verification_email_logs"("created_at");

-- CreateIndex
CREATE INDEX "idx_inventory_items_restaurant" ON "public"."inventory_items"("restaurant_id");

-- CreateIndex
CREATE INDEX "idx_inventory_transactions_item" ON "public"."inventory_transactions"("inventory_item_id");

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
CREATE INDEX "idx_voucher_usages_voucher" ON "public"."voucher_usages"("voucher_id");

-- CreateIndex
CREATE INDEX "idx_voucher_usages_user" ON "public"."voucher_usages"("user_id");

-- CreateIndex
CREATE INDEX "idx_logistics_orders_from" ON "public"."logistics_orders"("from_restaurant_id");

-- CreateIndex
CREATE INDEX "idx_logistics_orders_to" ON "public"."logistics_orders"("to_restaurant_id");

-- CreateIndex
CREATE INDEX "idx_logistics_order_items_order" ON "public"."logistics_order_items"("logistics_order_id");

-- CreateIndex
CREATE INDEX "idx_logistics_order_items_item" ON "public"."logistics_order_items"("inventory_item_id");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "public"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_sessions_expires" ON "public"."sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_sessions_user_valid" ON "public"."sessions"("user_id", "is_valid");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_stats" ADD CONSTRAINT "affiliate_stats_affiliate_user_id_fkey" FOREIGN KEY ("affiliate_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_stats" ADD CONSTRAINT "affiliate_stats_associated_order_id_fkey" FOREIGN KEY ("associated_order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_participants" ADD CONSTRAINT "conversation_participants_last_read_message_id_fkey" FOREIGN KEY ("last_read_message_id") REFERENCES "public"."messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_affiliate_user_id_fkey" FOREIGN KEY ("affiliate_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_categories" ADD CONSTRAINT "post_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_categories" ADD CONSTRAINT "post_categories_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_tags" ADD CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_tags" ADD CONSTRAINT "product_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."restaurant_chains" ADD CONSTRAINT "restaurant_chains_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "public"."restaurant_chains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurants" ADD CONSTRAINT "restaurants_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_staffs" ADD CONSTRAINT "restaurant_staffs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."restaurant_staffs" ADD CONSTRAINT "restaurant_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_assignments" ADD CONSTRAINT "task_assignments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."task_assignments" ADD CONSTRAINT "task_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."verification_email_logs" ADD CONSTRAINT "verification_email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vouchers" ADD CONSTRAINT "vouchers_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voucher_usages" ADD CONSTRAINT "voucher_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logistics_orders" ADD CONSTRAINT "logistics_orders_from_restaurant_id_fkey" FOREIGN KEY ("from_restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logistics_orders" ADD CONSTRAINT "logistics_orders_to_restaurant_id_fkey" FOREIGN KEY ("to_restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logistics_order_items" ADD CONSTRAINT "logistics_order_items_logistics_order_id_fkey" FOREIGN KEY ("logistics_order_id") REFERENCES "public"."logistics_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logistics_order_items" ADD CONSTRAINT "logistics_order_items_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
