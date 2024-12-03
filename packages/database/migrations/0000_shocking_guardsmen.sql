CREATE TABLE IF NOT EXISTS "embedding" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"text" text NOT NULL,
	"lang" text NOT NULL,
	"start" integer NOT NULL,
	"videoId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"summary" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embedding" ADD CONSTRAINT "embedding_videoId_video_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
