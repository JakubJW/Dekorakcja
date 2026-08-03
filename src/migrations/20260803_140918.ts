import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "variants" ADD COLUMN "use_inventory" boolean;
  ALTER TABLE "_variants_v" ADD COLUMN "version_use_inventory" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "variants" DROP COLUMN "use_inventory";
  ALTER TABLE "_variants_v" DROP COLUMN "version_use_inventory";`)
}
