import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_addresses_country" AS ENUM('AU', 'AT', 'BE', 'BR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GR', 'ES', 'NL', 'HK', 'IN', 'IE', 'JP', 'CA', 'LT', 'LU', 'LV', 'MY', 'MT', 'MX', 'DE', 'NO', 'NZ', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'US', 'CH', 'SE', 'HU', 'GB', 'IT');
  ALTER TABLE "addresses" ALTER COLUMN "customer_id" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "country" SET DATA TYPE "public"."enum_addresses_country" USING "country"::"public"."enum_addresses_country";
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_first_name" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_last_name" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_tax_id" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_company_name" varchar;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_email" varchar NOT NULL;
  ALTER TABLE "transactions" DROP COLUMN "billing_address_type";
  DROP TYPE "public"."enum_transactions_billing_address_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_transactions_billing_address_type" AS ENUM('person', 'organization');
  ALTER TABLE "addresses" ALTER COLUMN "customer_id" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "country" SET DATA TYPE varchar;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_first_name" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_last_name" SET NOT NULL;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_type" "enum_transactions_billing_address_type" DEFAULT 'person';
  ALTER TABLE "orders" DROP COLUMN "shipping_address_tax_id";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_company_name";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_email";
  DROP TYPE "public"."enum_addresses_country";`)
}
