import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rent_carts" ADD COLUMN "secret" varchar;
  ALTER TABLE "rent_carts" ADD COLUMN "submitted_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rent_carts" DROP COLUMN "secret";
  ALTER TABLE "rent_carts" DROP COLUMN "submitted_at";`)
}
