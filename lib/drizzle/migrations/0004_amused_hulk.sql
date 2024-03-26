CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_title" text NOT NULL,
	"user_id" text NOT NULL,
	"user_image" text,
	"user_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
