DROP TABLE "user_rate_limits";--> statement-breakpoint
ALTER TABLE "rateLimits" RENAME COLUMN "userUUID" TO "clientUUID";--> statement-breakpoint
ALTER TABLE "tempEmbedding" RENAME COLUMN "userUUID" TO "clientUUID";--> statement-breakpoint
ALTER TABLE "tempVideo" RENAME COLUMN "userUUID" TO "clientUUID";--> statement-breakpoint
ALTER TABLE "rateLimits" DROP CONSTRAINT "rateLimits_userUUID_unique";--> statement-breakpoint
ALTER TABLE "tempEmbedding" DROP CONSTRAINT "tempEmbedding_userUUID_unique";--> statement-breakpoint
ALTER TABLE "tempVideo" DROP CONSTRAINT "tempVideo_userUUID_unique";--> statement-breakpoint
ALTER TABLE "rateLimits" ADD CONSTRAINT "rateLimits_clientUUID_unique" UNIQUE("clientUUID");--> statement-breakpoint
ALTER TABLE "tempEmbedding" ADD CONSTRAINT "tempEmbedding_clientUUID_unique" UNIQUE("clientUUID");--> statement-breakpoint
ALTER TABLE "tempVideo" ADD CONSTRAINT "tempVideo_clientUUID_unique" UNIQUE("clientUUID");