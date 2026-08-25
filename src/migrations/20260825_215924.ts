import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "addresses" ALTER COLUMN "customer_id" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "first_name" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "last_name" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "address_line1" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "city" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "postal_code" SET NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "addresses" DROP COLUMN "company";
  ALTER TABLE "addresses" DROP COLUMN "state";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "addresses" ALTER COLUMN "customer_id" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "first_name" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "last_name" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "address_line1" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "city" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "postal_code" DROP NOT NULL;
  ALTER TABLE "addresses" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "addresses" ADD COLUMN "company" varchar;
  ALTER TABLE "addresses" ADD COLUMN "state" varchar;`)
}
