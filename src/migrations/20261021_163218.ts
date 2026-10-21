import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_billing_address_type" AS ENUM('person', 'organization');
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_first_name" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_last_name" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_address_line1" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_city" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_postal_code" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_phone" SET NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_type" "enum_orders_billing_address_type" DEFAULT 'person';
  ALTER TABLE "orders" ADD COLUMN "billing_address_first_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_last_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_nip" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_company_name" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_address_line1" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_address_line2" varchar;
  ALTER TABLE "orders" ADD COLUMN "billing_address_city" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_postal_code" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_country" varchar DEFAULT 'PL' NOT NULL;
  ALTER TABLE "orders" DROP COLUMN "shipping_address_title";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_company";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_state";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_country";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ALTER COLUMN "shipping_address_first_name" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_last_name" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_address_line1" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_city" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_postal_code" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_phone" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_title" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_company" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_state" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_country" varchar;
  ALTER TABLE "orders" DROP COLUMN "billing_address_type";
  ALTER TABLE "orders" DROP COLUMN "billing_address_first_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_last_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_nip";
  ALTER TABLE "orders" DROP COLUMN "billing_address_company_name";
  ALTER TABLE "orders" DROP COLUMN "billing_address_address_line1";
  ALTER TABLE "orders" DROP COLUMN "billing_address_address_line2";
  ALTER TABLE "orders" DROP COLUMN "billing_address_city";
  ALTER TABLE "orders" DROP COLUMN "billing_address_postal_code";
  ALTER TABLE "orders" DROP COLUMN "billing_address_country";
  DROP TYPE "public"."enum_orders_billing_address_type";`)
}
