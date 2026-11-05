import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_shipping_address_country" AS ENUM('US', 'GB', 'CA', 'AU', 'AT', 'BE', 'BR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IN', 'IE', 'IT', 'JP', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH');
  CREATE TYPE "public"."enum_orders_billing_address_country" AS ENUM('US', 'GB', 'CA', 'AU', 'AT', 'BE', 'BR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IN', 'IE', 'IT', 'JP', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH');
  ALTER TABLE "orders" ALTER COLUMN "billing_address_country" DROP DEFAULT;
  ALTER TABLE "orders" ALTER COLUMN "billing_address_country" SET DATA TYPE "public"."enum_orders_billing_address_country" USING "billing_address_country"::"public"."enum_orders_billing_address_country";
  ALTER TABLE "addresses" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "shipping_address_country" "enum_orders_shipping_address_country" NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" ALTER COLUMN "billing_address_country" DROP DEFAULT;
   ALTER TABLE "orders" ALTER COLUMN "billing_address_country" SET DATA TYPE varchar;
  ALTER TABLE "orders" ALTER COLUMN "billing_address_country" SET DEFAULT 'PL';
  ALTER TABLE "addresses" DROP COLUMN "email";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_country";
  DROP TYPE "public"."enum_orders_shipping_address_country";
  DROP TYPE "public"."enum_orders_billing_address_country";`)
}
