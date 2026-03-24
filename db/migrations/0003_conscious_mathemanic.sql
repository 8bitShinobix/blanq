CREATE TABLE "workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text DEFAULT 'My workspace' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "workspace_id" text;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "cover_type" text;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "cover_value" text;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "cover_position_y" integer DEFAULT 50;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "form_data" jsonb DEFAULT '{"blocks":[],"customization":{}}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_user_id_idx" ON "workspace" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_default_per_user_idx" ON "workspace" USING btree ("user_id") WHERE is_default = true;--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form" DROP COLUMN "schema";