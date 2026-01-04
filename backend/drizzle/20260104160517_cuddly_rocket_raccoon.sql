CREATE TABLE "waitlist_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"age" integer NOT NULL,
	"city" text NOT NULL,
	"province_state" text NOT NULL,
	"country" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"looking_for" text[] DEFAULT '{}' NOT NULL,
	"additional_information" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_applications_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "email_idx" ON "waitlist_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "status_idx" ON "waitlist_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "waitlist_applications" USING btree ("created_at");