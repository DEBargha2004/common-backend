ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD COLUMN "is_active" boolean;