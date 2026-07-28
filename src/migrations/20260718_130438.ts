import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "occastions" RENAME TO "occasions";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "occastions_id" TO "occasions_id";
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_categories_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_occastions_fk";
  
  DROP INDEX "occastions_slug_idx";
  DROP INDEX "occastions_updated_at_idx";
  DROP INDEX "occastions_created_at_idx";
  DROP INDEX "products_rels_categories_id_idx";
  DROP INDEX "_products_v_rels_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_occastions_id_idx";
  ALTER TABLE "products_rels" ADD COLUMN "occasions_id" integer;
  ALTER TABLE "_products_v_rels" ADD COLUMN "occasions_id" integer;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_occasions_fk" FOREIGN KEY ("occasions_id") REFERENCES "public"."occasions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_occasions_fk" FOREIGN KEY ("occasions_id") REFERENCES "public"."occasions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_occasions_fk" FOREIGN KEY ("occasions_id") REFERENCES "public"."occasions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "occasions_slug_idx" ON "occasions" USING btree ("slug");
  CREATE INDEX "occasions_updated_at_idx" ON "occasions" USING btree ("updated_at");
  CREATE INDEX "occasions_created_at_idx" ON "occasions" USING btree ("created_at");
  CREATE INDEX "products_rels_occasions_id_idx" ON "products_rels" USING btree ("occasions_id");
  CREATE INDEX "_products_v_rels_occasions_id_idx" ON "_products_v_rels" USING btree ("occasions_id");
  CREATE INDEX "payload_locked_documents_rels_occasions_id_idx" ON "payload_locked_documents_rels" USING btree ("occasions_id");
  ALTER TABLE "products_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_products_v_rels" DROP COLUMN "categories_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "occasions" RENAME TO "occastions";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "occasions_id" TO "occastions_id";
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_occasions_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_occasions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_occasions_fk";
  
  DROP INDEX "occasions_slug_idx";
  DROP INDEX "occasions_updated_at_idx";
  DROP INDEX "occasions_created_at_idx";
  DROP INDEX "products_rels_occasions_id_idx";
  DROP INDEX "_products_v_rels_occasions_id_idx";
  DROP INDEX "payload_locked_documents_rels_occasions_id_idx";
  ALTER TABLE "products_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_products_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_occastions_fk" FOREIGN KEY ("occastions_id") REFERENCES "public"."occastions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "occastions_slug_idx" ON "occastions" USING btree ("slug");
  CREATE INDEX "occastions_updated_at_idx" ON "occastions" USING btree ("updated_at");
  CREATE INDEX "occastions_created_at_idx" ON "occastions" USING btree ("created_at");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_occastions_id_idx" ON "payload_locked_documents_rels" USING btree ("occastions_id");
  ALTER TABLE "products_rels" DROP COLUMN "occasions_id";
  ALTER TABLE "_products_v_rels" DROP COLUMN "occasions_id";`)
}
