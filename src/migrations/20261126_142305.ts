import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "billing_address_type";
  ALTER TABLE "orders" DROP COLUMN "billing_address_first_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_last_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_email";
  ALTER TABLE "orders" DROP COLUMN "billing_address_tax_id";
  ALTER TABLE "orders" DROP COLUMN "billing_address_company_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_address_line1";
  ALTER TABLE "orders" DROP COLUMN "billing_address_address_line2";
  ALTER TABLE "orders" DROP COLUMN "billing_address_city";
  ALTER TABLE "orders" DROP COLUMN "billing_address_phone";
  ALTER TABLE "orders" DROP COLUMN "billing_address_postal_code";
  ALTER TABLE "orders" DROP COLUMN "billing_address_country";
  DROP TYPE "public"."enum_orders_billing_address_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_billing_address_type" AS ENUM('person', 'organization');
  ALTER TABLE "orders" ADD COLUMN "billing_address_type" "enum_orders_billing_address_type" DEFAULT 'person';
  ALTER TABLE "orders" ADD COLUMN "billing_address_first_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_last_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_email" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_tax_id" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_company_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_address_line1" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_address_line2" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_city" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_phone" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_postal_code" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_country" varchar NOT NULL;`)
}
