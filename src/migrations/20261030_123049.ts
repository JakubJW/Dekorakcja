import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "billing_addresses" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_billing_addresses_fk";
  DROP TABLE "billing_addresses" CASCADE;
  
  DROP INDEX "payload_locked_documents_rels_billing_addresses_id_idx";
  ALTER TABLE "addresses" ALTER COLUMN "first_name" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "last_name" DROP NOT NULL;
  ALTER TABLE "addresses" ADD COLUMN "tax_id" varchar;
  ALTER TABLE "addresses" ADD COLUMN "company_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_method_id" integer NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_phone" varchar NOT NULL;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_method_id_shipping_methods_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_methods"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "orders_shipping_method_idx" ON "orders" USING btree ("shipping_method_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "billing_addresses_id";
  DROP TYPE "public"."enum_billing_addresses_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_billing_addresses_type" AS ENUM('person', 'organization');
  CREATE TABLE "billing_addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_billing_addresses_type" NOT NULL,
  	"customer_id" integer,
  	"first_name" varchar,
  	"last_name" varchar,
  	"nip" varchar,
  	"company_name" varchar,
  	"address_line1" varchar NOT NULL,
  	"address_line2" varchar,
  	"city" varchar NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_method_id_shipping_methods_id_fk";
  
  DROP INDEX "orders_shipping_method_idx";
  ALTER TABLE "addresses" ALTER COLUMN "first_name" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "last_name" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "billing_addresses_id" integer;
  ALTER TABLE "billing_addresses" ADD CONSTRAINT "billing_addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "billing_addresses_customer_idx" ON "billing_addresses" USING btree ("customer_id");
  CREATE INDEX "billing_addresses_updated_at_idx" ON "billing_addresses" USING btree ("updated_at");
  CREATE INDEX "billing_addresses_created_at_idx" ON "billing_addresses" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_billing_addresses_fk" FOREIGN KEY ("billing_addresses_id") REFERENCES "public"."billing_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_billing_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("billing_addresses_id");
  ALTER TABLE "addresses" DROP COLUMN "tax_id";
  ALTER TABLE "addresses" DROP COLUMN "company_name";
  ALTER TABLE "orders" DROP COLUMN "shipping_method_id";
  ALTER TABLE "orders" DROP COLUMN "billing_address_phone";`)
}
