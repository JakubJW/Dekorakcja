import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  ALTER TABLE "organization_addresses" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "organization_addresses" CASCADE;
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "billing_addresses_id" integer;
  ALTER TABLE "billing_addresses" ADD CONSTRAINT "billing_addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "billing_addresses_customer_idx" ON "billing_addresses" USING btree ("customer_id");
  CREATE INDEX "billing_addresses_updated_at_idx" ON "billing_addresses" USING btree ("updated_at");
  CREATE INDEX "billing_addresses_created_at_idx" ON "billing_addresses" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_billing_addresses_fk" FOREIGN KEY ("billing_addresses_id") REFERENCES "public"."billing_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_billing_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("billing_addresses_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "organization_addresses_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "organization_addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"nip" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"address_line1" varchar NOT NULL,
  	"address_line2" varchar,
  	"city" varchar NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "billing_addresses" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "billing_addresses" CASCADE;
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "organization_addresses_id" integer;
  ALTER TABLE "organization_addresses" ADD CONSTRAINT "organization_addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "organization_addresses_customer_idx" ON "organization_addresses" USING btree ("customer_id");
  CREATE INDEX "organization_addresses_updated_at_idx" ON "organization_addresses" USING btree ("updated_at");
  CREATE INDEX "organization_addresses_created_at_idx" ON "organization_addresses" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organization_addresses_fk" FOREIGN KEY ("organization_addresses_id") REFERENCES "public"."organization_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_organization_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("organization_addresses_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "billing_addresses_id";
  DROP TYPE "public"."enum_billing_addresses_type";`)
}
