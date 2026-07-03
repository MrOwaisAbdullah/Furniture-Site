CREATE TABLE "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "affiliate_payouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliate_id" integer NOT NULL,
	"order_ref" text NOT NULL,
	"order_value" numeric(12, 2) NOT NULL,
	"payout_owed" numeric(12, 2) NOT NULL,
	"payout_status" text DEFAULT 'owed' NOT NULL,
	"paid_at" timestamp,
	"payment_ref" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"referral_code" text NOT NULL,
	"commission_pct" numeric(5, 2) DEFAULT '5' NOT NULL,
	"discount_for_buyer" numeric(10, 2) DEFAULT '0' NOT NULL,
	"platform" text,
	"handle" text,
	"follower_count" integer,
	"content_type" text,
	"content_deadline" timestamp,
	"content_live_url" text,
	"collab_notes" text,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_earned" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliates_phone_unique" UNIQUE("phone"),
	CONSTRAINT "affiliates_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "category_costs" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_slug" text NOT NULL,
	"manufacturing_cost" numeric(12, 2) NOT NULL,
	"showroom_margin_pct" numeric(5, 2) DEFAULT '20' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_costs_category_slug_unique" UNIQUE("category_slug")
);
--> statement-breakpoint
CREATE TABLE "cost_mode" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_slug" text NOT NULL,
	"mode" text DEFAULT 'average' NOT NULL,
	CONSTRAINT "cost_mode_category_slug_unique" UNIQUE("category_slug")
);
--> statement-breakpoint
CREATE TABLE "coupon_redemptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"coupon_id" integer NOT NULL,
	"customer_phone" text NOT NULL,
	"order_ref" text NOT NULL,
	"order_value" numeric(12, 2) NOT NULL,
	"discount_applied" numeric(12, 2) NOT NULL,
	"redeemed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"min_order_value" numeric(12, 2),
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"per_user_limit" integer,
	"combinable" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"affiliate_id" integer,
	"target_phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "email_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'footer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"event" text NOT NULL,
	"page" text,
	"product_id" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_ref" text NOT NULL,
	"gift_tier" text,
	"gift_given_at" timestamp,
	"thankyou_code_sent" boolean DEFAULT false NOT NULL,
	"thankyou_code_sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gifts_order_ref_unique" UNIQUE("order_ref")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"product_slug" text,
	"message" text,
	"source" text DEFAULT 'contact_form' NOT NULL,
	"followed_up" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "material_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"unit" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "material_rates_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"ref" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"delivery_area" text,
	"delivery_address" text,
	"delivery_method" text DEFAULT 'delivery' NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"advance" numeric(12, 2) NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"payment_screenshot" text,
	"coupon_code" text,
	"referral_code" text,
	"affiliate_code" text,
	"affiliate_commission" numeric(12, 2),
	"channel" text DEFAULT 'online' NOT NULL,
	"status" text DEFAULT 'payment_pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_ref_unique" UNIQUE("ref")
);
--> statement-breakpoint
CREATE TABLE "piece_costs" (
	"id" serial PRIMARY KEY NOT NULL,
	"piece_type" text NOT NULL,
	"label" text NOT NULL,
	"sheets_16mm" numeric(6, 2) DEFAULT '0' NOT NULL,
	"thin_sheets" numeric(6, 2) DEFAULT '0' NOT NULL,
	"thapary" boolean DEFAULT false NOT NULL,
	"foam" boolean DEFAULT false NOT NULL,
	"mirror" boolean DEFAULT false NOT NULL,
	"hardware_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"labour_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"deco_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "piece_costs_piece_type_unique" UNIQUE("piece_type")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_slug" text NOT NULL,
	"name" text NOT NULL,
	"rating" integer NOT NULL,
	"body" text NOT NULL,
	"photo_url" text,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"share_token" text,
	"product_id" text NOT NULL,
	"product_name" text NOT NULL,
	"product_slug" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"finish_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_payouts" ADD CONSTRAINT "affiliate_payouts_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_payouts_affiliate_idx" ON "affiliate_payouts" USING btree ("affiliate_id");--> statement-breakpoint
CREATE INDEX "affiliate_payouts_status_idx" ON "affiliate_payouts" USING btree ("payout_status");--> statement-breakpoint
CREATE INDEX "coupon_redemptions_phone_idx" ON "coupon_redemptions" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "coupon_redemptions_coupon_idx" ON "coupon_redemptions" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX "events_session_idx" ON "events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "events_event_idx" ON "events" USING btree ("event");--> statement-breakpoint
CREATE INDEX "events_created_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_followed_up_idx" ON "leads" USING btree ("followed_up");--> statement-breakpoint
CREATE INDEX "orders_phone_idx" ON "orders" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_channel_idx" ON "orders" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_slug");--> statement-breakpoint
CREATE INDEX "reviews_approved_idx" ON "reviews" USING btree ("approved");--> statement-breakpoint
CREATE INDEX "wishlist_session_idx" ON "wishlist_items" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "wishlist_token_idx" ON "wishlist_items" USING btree ("share_token");