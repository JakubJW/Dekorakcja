import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_shipping_methods_type" AS ENUM('courier', 'locker');
  CREATE TABLE "shipping_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_shipping_methods_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"sort_order" numeric,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "shipping_methods_id" integer;
  CREATE UNIQUE INDEX "shipping_methods_slug_idx" ON "shipping_methods" USING btree ("slug");
  CREATE INDEX "shipping_methods_updated_at_idx" ON "shipping_methods" USING btree ("updated_at");
  CREATE INDEX "shipping_methods_created_at_idx" ON "shipping_methods" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shipping_methods_fk" FOREIGN KEY ("shipping_methods_id") REFERENCES "public"."shipping_methods"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_shipping_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("shipping_methods_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "shipping_methods" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "shipping_methods" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_shipping_methods_fk";
  
  DROP INDEX "payload_locked_documents_rels_shipping_methods_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "shipping_methods_id";
  DROP TYPE "public"."enum_shipping_methods_type";`)
}
