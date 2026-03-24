CREATE TYPE "public"."feature_request_category" AS ENUM('bug', 'feature', 'improvement', 'integration');--> statement-breakpoint
CREATE TYPE "public"."feature_request_status" AS ENUM('open', 'under_review', 'planned', 'in_progress', 'completed', 'declined');--> statement-breakpoint
CREATE TABLE "feature_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "feature_request_status" DEFAULT 'open' NOT NULL,
	"category" "feature_request_category" DEFAULT 'feature' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_request_vote" (
	"id" text PRIMARY KEY NOT NULL,
	"feature_request_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feature_request" ADD CONSTRAINT "feature_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_request_vote" ADD CONSTRAINT "feature_request_vote_feature_request_id_feature_request_id_fk" FOREIGN KEY ("feature_request_id") REFERENCES "public"."feature_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_request_vote" ADD CONSTRAINT "feature_request_vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feature_request_user_id_idx" ON "feature_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feature_request_status_idx" ON "feature_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "feature_request_vote_request_id_idx" ON "feature_request_vote" USING btree ("feature_request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "feature_request_vote_unique_idx" ON "feature_request_vote" USING btree ("feature_request_id","user_id");