import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_addresses_kind" AS ENUM('person', 'organization');
  CREATE TYPE "public"."enum_orders_shipping_address_kind" AS ENUM('person', 'organization');
  CREATE TYPE "public"."enum_transactions_billing_address_kind" AS ENUM('person', 'organization');
  ALTER TABLE "addresses" ADD COLUMN "kind" "enum_addresses_kind" DEFAULT 'person';
  ALTER TABLE "orders" ADD COLUMN "shipping_address_kind" "enum_orders_shipping_address_kind" DEFAULT 'person';
  ALTER TABLE "transactions" ADD COLUMN "billing_address_kind" "enum_transactions_billing_address_kind" DEFAULT 'person';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "addresses" DROP COLUMN "kind";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_kind";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_kind";
  DROP TYPE "public"."enum_addresses_kind";
  DROP TYPE "public"."enum_orders_shipping_address_kind";
  DROP TYPE "public"."enum_transactions_billing_address_kind";`)
}
