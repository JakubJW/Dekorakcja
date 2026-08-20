import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "variants" RENAME COLUMN "price_in_u_s_d_enabled" TO "price_in_p_l_n_enabled";
  ALTER TABLE "variants" RENAME COLUMN "price_in_u_s_d" TO "price_in_p_l_n";
  ALTER TABLE "_variants_v" RENAME COLUMN "version_price_in_u_s_d_enabled" TO "version_price_in_p_l_n_enabled";
  ALTER TABLE "_variants_v" RENAME COLUMN "version_price_in_u_s_d" TO "version_price_in_p_l_n";
  ALTER TABLE "products" RENAME COLUMN "price_in_u_s_d_enabled" TO "price_in_p_l_n_enabled";
  ALTER TABLE "products" RENAME COLUMN "price_in_u_s_d" TO "price_in_p_l_n";
  ALTER TABLE "_products_v" RENAME COLUMN "version_price_in_u_s_d_enabled" TO "version_price_in_p_l_n_enabled";
  ALTER TABLE "_products_v" RENAME COLUMN "version_price_in_u_s_d" TO "version_price_in_p_l_n";
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'PLN'::text;
  UPDATE "carts" SET "currency" = 'PLN' WHERE "currency" = 'USD';
  DROP TYPE "public"."enum_carts_currency";
  CREATE TYPE "public"."enum_carts_currency" AS ENUM('PLN');
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'PLN'::"public"."enum_carts_currency";
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_carts_currency" USING "currency"::"public"."enum_carts_currency";
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'PLN'::text;
  UPDATE "orders" SET "currency" = 'PLN' WHERE "currency" = 'USD';
  DROP TYPE "public"."enum_orders_currency";
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('PLN');
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'PLN'::"public"."enum_orders_currency";
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_orders_currency" USING "currency"::"public"."enum_orders_currency";
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'PLN'::text;
  UPDATE "transactions" SET "currency" = 'PLN' WHERE "currency" = 'USD';
  DROP TYPE "public"."enum_transactions_currency";
  CREATE TYPE "public"."enum_transactions_currency" AS ENUM('PLN');
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'PLN'::"public"."enum_transactions_currency";
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_transactions_currency" USING "currency"::"public"."enum_transactions_currency";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "variants" RENAME COLUMN "price_in_p_l_n_enabled" TO "price_in_u_s_d_enabled";
  ALTER TABLE "variants" RENAME COLUMN "price_in_p_l_n" TO "price_in_u_s_d";
  ALTER TABLE "_variants_v" RENAME COLUMN "version_price_in_p_l_n_enabled" TO "version_price_in_u_s_d_enabled";
  ALTER TABLE "_variants_v" RENAME COLUMN "version_price_in_p_l_n" TO "version_price_in_u_s_d";
  ALTER TABLE "products" RENAME COLUMN "price_in_p_l_n_enabled" TO "price_in_u_s_d_enabled";
  ALTER TABLE "products" RENAME COLUMN "price_in_p_l_n" TO "price_in_u_s_d";
  ALTER TABLE "_products_v" RENAME COLUMN "version_price_in_p_l_n_enabled" TO "version_price_in_u_s_d_enabled";
  ALTER TABLE "_products_v" RENAME COLUMN "version_price_in_p_l_n" TO "version_price_in_u_s_d";
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'USD'::text;
  DROP TYPE "public"."enum_carts_currency";
  CREATE TYPE "public"."enum_carts_currency" AS ENUM('USD');
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'USD'::"public"."enum_carts_currency";
  ALTER TABLE "carts" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_carts_currency" USING "currency"::"public"."enum_carts_currency";
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'USD'::text;
  DROP TYPE "public"."enum_orders_currency";
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('USD');
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'USD'::"public"."enum_orders_currency";
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_orders_currency" USING "currency"::"public"."enum_orders_currency";
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'USD'::text;
  DROP TYPE "public"."enum_transactions_currency";
  CREATE TYPE "public"."enum_transactions_currency" AS ENUM('USD');
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'USD'::"public"."enum_transactions_currency";
  ALTER TABLE "transactions" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_transactions_currency" USING "currency"::"public"."enum_transactions_currency";`)
}
