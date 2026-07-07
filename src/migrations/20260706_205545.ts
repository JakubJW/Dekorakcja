import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_faq_pytania" RENAME TO "pages_blocks_faq_faqs";
  ALTER TABLE "_pages_v_blocks_faq_pytania" RENAME TO "_pages_v_blocks_faq_faqs";
  ALTER TABLE "pages_blocks_faq_faqs" RENAME COLUMN "tre_pytania" TO "question";
  ALTER TABLE "pages_blocks_faq_faqs" RENAME COLUMN "rich_text" TO "answer";
  ALTER TABLE "_pages_v_blocks_faq_faqs" RENAME COLUMN "tre_pytania" TO "question";
  ALTER TABLE "_pages_v_blocks_faq_faqs" RENAME COLUMN "rich_text" TO "answer";
  ALTER TABLE "pages_blocks_faq_faqs" DROP CONSTRAINT "pages_blocks_faq_pytania_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_faq_faqs" DROP CONSTRAINT "_pages_v_blocks_faq_pytania_parent_id_fk";
  
  DROP INDEX "pages_blocks_faq_pytania_order_idx";
  DROP INDEX "pages_blocks_faq_pytania_parent_id_idx";
  DROP INDEX "_pages_v_blocks_faq_pytania_order_idx";
  DROP INDEX "_pages_v_blocks_faq_pytania_parent_id_idx";
  ALTER TABLE "pages_blocks_faq_faqs" ADD CONSTRAINT "pages_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_faq_faqs_order_idx" ON "pages_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_faqs_parent_id_idx" ON "pages_blocks_faq_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_faqs_order_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_faqs_parent_id_idx" ON "_pages_v_blocks_faq_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_faq_faqs" RENAME TO "pages_blocks_faq_pytania";
  ALTER TABLE "_pages_v_blocks_faq_faqs" RENAME TO "_pages_v_blocks_faq_pytania";
  ALTER TABLE "pages_blocks_faq_pytania" RENAME COLUMN "question" TO "tre_pytania";
  ALTER TABLE "pages_blocks_faq_pytania" RENAME COLUMN "answer" TO "rich_text";
  ALTER TABLE "_pages_v_blocks_faq_pytania" RENAME COLUMN "question" TO "tre_pytania";
  ALTER TABLE "_pages_v_blocks_faq_pytania" RENAME COLUMN "answer" TO "rich_text";
  ALTER TABLE "pages_blocks_faq_pytania" DROP CONSTRAINT "pages_blocks_faq_faqs_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_faq_pytania" DROP CONSTRAINT "_pages_v_blocks_faq_faqs_parent_id_fk";
  
  DROP INDEX "pages_blocks_faq_faqs_order_idx";
  DROP INDEX "pages_blocks_faq_faqs_parent_id_idx";
  DROP INDEX "_pages_v_blocks_faq_faqs_order_idx";
  DROP INDEX "_pages_v_blocks_faq_faqs_parent_id_idx";
  ALTER TABLE "pages_blocks_faq_pytania" ADD CONSTRAINT "pages_blocks_faq_pytania_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_pytania" ADD CONSTRAINT "_pages_v_blocks_faq_pytania_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_faq_pytania_order_idx" ON "pages_blocks_faq_pytania" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_pytania_parent_id_idx" ON "pages_blocks_faq_pytania" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_pytania_order_idx" ON "_pages_v_blocks_faq_pytania" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_pytania_parent_id_idx" ON "_pages_v_blocks_faq_pytania" USING btree ("_parent_id");`)
}
