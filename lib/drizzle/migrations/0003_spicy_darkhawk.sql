DO $$ BEGIN
 CREATE TYPE "upload_status" AS ENUM('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pdf_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"upload_status" "upload_status" DEFAULT 'PENDING',
	"url" text NOT NULL,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pdf_file_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"pdf_file_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_user_message" boolean NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"stripe_current_period_end" timestamp
);
