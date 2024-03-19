CREATE TABLE IF NOT EXISTS "post_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"mood" text NOT NULL,
	"summary" text NOT NULL,
	"color" text NOT NULL,
	"negative" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
