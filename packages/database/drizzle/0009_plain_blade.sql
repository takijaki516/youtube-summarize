CREATE TABLE IF NOT EXISTS "userRateLimit" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userRateLimit_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userRateLimit" ADD CONSTRAINT "userRateLimit_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
