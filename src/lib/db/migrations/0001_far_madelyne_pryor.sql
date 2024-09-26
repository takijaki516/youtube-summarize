CREATE TABLE IF NOT EXISTS "video" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"url" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video" ADD CONSTRAINT "video_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
