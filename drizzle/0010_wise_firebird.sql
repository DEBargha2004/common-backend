ALTER TABLE "flows" ADD COLUMN "is_processing" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "flows" ADD COLUMN "query_prompt" text;