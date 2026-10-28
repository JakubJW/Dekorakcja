import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_invoices_status" AS ENUM('pending', 'processing', 'success', 'failed');
  CREATE TABLE "invoices_attempts_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"status" varchar NOT NULL,
  	"message" varchar,
  	"response_payload" jsonb
  );
  
  CREATE TABLE "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer NOT NULL,
  	"status" "enum_invoices_status" DEFAULT 'pending' NOT NULL,
  	"invoice_number" varchar,
  	"subiekt_id" varchar,
  	"issued_at" timestamp(3) with time zone,
  	"pdf_url" varchar,
  	"retry_count" numeric DEFAULT 0,
  	"last_attempt_at" timestamp(3) with time zone,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invoices_id" integer;
  ALTER TABLE "invoices_attempts_log" ADD CONSTRAINT "invoices_attempts_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "invoices_attempts_log_order_idx" ON "invoices_attempts_log" USING btree ("_order");
  CREATE INDEX "invoices_attempts_log_parent_id_idx" ON "invoices_attempts_log" USING btree ("_parent_id");
  CREATE INDEX "invoices_order_idx" ON "invoices" USING btree ("order_id");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "invoices_attempts_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invoices" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "invoices_attempts_log" CASCADE;
  DROP TABLE "invoices" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invoices_fk";
  
  DROP INDEX "payload_locked_documents_rels_invoices_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invoices_id";
  DROP TYPE "public"."enum_invoices_status";`)
}
