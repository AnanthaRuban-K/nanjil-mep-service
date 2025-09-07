CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(100),
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(15),
	"role" varchar(20) DEFAULT 'admin',
	"is_active" varchar(10) DEFAULT 'true' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_number" varchar(20) NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"description" text NOT NULL,
	"contact_info" jsonb NOT NULL,
	"scheduled_time" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"total_cost" numeric(10, 2),
	"rating" integer,
	"review" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "bookings_booking_number_unique" UNIQUE("booking_number")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(100),
	"name" varchar(100) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"address" text,
	"language" varchar(5) DEFAULT 'ta',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_ta" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"description_en" text,
	"description_ta" text,
	"base_cost" numeric(10, 2) NOT NULL,
	"is_active" varchar(10) DEFAULT 'true' NOT NULL
);
