ALTER TABLE "tempVideo" ALTER COLUMN "summary" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "summary" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tempVideo" ADD COLUMN "raw_summary" text;