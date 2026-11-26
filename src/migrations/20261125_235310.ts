import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_shipments_provider" AS ENUM('inpost', 'dhl');
  CREATE TYPE "public"."enum_shipments_status" AS ENUM('created', 'confirmed', 'in_transit', 'delivered', 'cancelled');
  ALTER TABLE "shipments" ADD COLUMN "provider" "enum_shipments_provider" DEFAULT 'inpost' NOT NULL;
  ALTER TABLE "shipments" ADD COLUMN "status" "enum_shipments_status" DEFAULT 'created';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "shipments" DROP COLUMN "provider";
  ALTER TABLE "shipments" DROP COLUMN "status";
  DROP TYPE "public"."enum_shipments_provider";
  DROP TYPE "public"."enum_shipments_status";`)
}
