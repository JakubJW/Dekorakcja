import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_transactions_billing_address_type" AS ENUM('person', 'organization');
  CREATE TYPE "public"."enum_transactions_billing_address_country" AS ENUM('US', 'GB', 'CA', 'AU', 'AT', 'BE', 'BR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IN', 'IE', 'IT', 'JP', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH');
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_address_line1" SET NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_city" SET NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_postal_code" SET NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_country" SET DATA TYPE "public"."enum_transactions_billing_address_country" USING "billing_address_country"::"public"."enum_transactions_billing_address_country";
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_country" SET NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_phone" SET NOT NULL;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_type" "enum_transactions_billing_address_type" DEFAULT 'person';
  ALTER TABLE "transactions" ADD COLUMN "billing_address_nip" varchar;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_company_name" varchar;
  ALTER TABLE "transactions" DROP COLUMN "billing_address_title";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_company";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_state";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "transactions" ALTER COLUMN "billing_address_address_line1" DROP NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_city" DROP NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_phone" DROP NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_postal_code" DROP NOT NULL;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_country" SET DATA TYPE varchar;
  ALTER TABLE "transactions" ALTER COLUMN "billing_address_country" DROP NOT NULL;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_title" varchar;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_company" varchar;
  ALTER TABLE "transactions" ADD COLUMN "billing_address_state" varchar;
  ALTER TABLE "transactions" DROP COLUMN "billing_address_type";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_nip";
  ALTER TABLE "transactions" DROP COLUMN "billing_address_company_name";
  DROP TYPE "public"."enum_transactions_billing_address_type";
  DROP TYPE "public"."enum_transactions_billing_address_country";`)
}
