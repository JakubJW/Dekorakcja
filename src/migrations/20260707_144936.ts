import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_faq" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "heading" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_faq" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "heading";`)
}
