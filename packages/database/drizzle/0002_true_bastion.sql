ALTER TABLE "rateLimits" RENAME COLUMN "key" TO "userUUID";--> statement-breakpoint
ALTER TABLE "rateLimits" DROP CONSTRAINT "rateLimits_key_unique";--> statement-breakpoint
ALTER TABLE "tempEmbedding" ADD COLUMN "userUUID" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tempVideo" ADD COLUMN "userUUID" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rateLimits" ADD CONSTRAINT "rateLimits_userUUID_unique" UNIQUE("userUUID");--> statement-breakpoint
ALTER TABLE "tempEmbedding" ADD CONSTRAINT "tempEmbedding_userUUID_unique" UNIQUE("userUUID");--> statement-breakpoint
ALTER TABLE "tempVideo" ADD CONSTRAINT "tempVideo_userUUID_unique" UNIQUE("userUUID");