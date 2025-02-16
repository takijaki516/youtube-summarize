ALTER TABLE "embedding" RENAME COLUMN "videoId" TO "videoSchemaId";--> statement-breakpoint
ALTER TABLE "tempEmbedding" RENAME COLUMN "videoId" TO "videoSchemaId";--> statement-breakpoint
ALTER TABLE "embedding" DROP CONSTRAINT "embedding_videoId_video_id_fk";
--> statement-breakpoint
ALTER TABLE "tempEmbedding" DROP CONSTRAINT "tempEmbedding_videoId_tempVideo_id_fk";
--> statement-breakpoint
ALTER TABLE "tempVideo" ADD COLUMN "videoId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "videoId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embedding" ADD CONSTRAINT "embedding_videoSchemaId_video_id_fk" FOREIGN KEY ("videoSchemaId") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tempEmbedding" ADD CONSTRAINT "tempEmbedding_videoSchemaId_tempVideo_id_fk" FOREIGN KEY ("videoSchemaId") REFERENCES "public"."tempVideo"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
