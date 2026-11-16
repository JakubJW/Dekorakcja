import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_personalization_options_type" AS ENUM('text');
  DROP INDEX "product_personalization_options_slug_idx";
  ALTER TABLE "product_personalization_options" ADD COLUMN "type" "enum_product_personalization_options_type";
  ALTER TABLE "product_personalization_options" DROP COLUMN "generate_slug";
  ALTER TABLE "product_personalization_options" DROP COLUMN "slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_personalization_options" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "product_personalization_options" ADD COLUMN "slug" varchar NOT NULL;
  CREATE UNIQUE INDEX "product_personalization_options_slug_idx" ON "product_personalization_options" USING btree ("slug");
  ALTER TABLE "product_personalization_options" DROP COLUMN "type";
  DROP TYPE "public"."enum_product_personalization_options_type";`)
}
