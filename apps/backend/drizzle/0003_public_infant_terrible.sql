CREATE TABLE "admin_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(500) NOT NULL,
	"admin_id" integer,
	"device_type" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_used" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "priority" varchar(20) DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_tokens" ADD CONSTRAINT "admin_tokens_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;