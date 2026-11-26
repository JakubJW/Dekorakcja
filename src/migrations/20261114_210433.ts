import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_personalization_options" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price_in_p_l_n_enabled" boolean,
  	"price_in_p_l_n" numeric,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "allow_customization" boolean DEFAULT false;
  ALTER TABLE "products_rels" ADD COLUMN "product_personalization_options_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_allow_customization" boolean DEFAULT false;
  ALTER TABLE "_products_v_rels" ADD COLUMN "product_personalization_options_id" integer;
  ALTER TABLE "carts_items" ADD COLUMN "personalization_text" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_personalization_options_id" integer;
  CREATE UNIQUE INDEX "product_personalization_options_slug_idx" ON "product_personalization_options" USING btree ("slug");
  CREATE INDEX "product_personalization_options_updated_at_idx" ON "product_personalization_options" USING btree ("updated_at");
  CREATE INDEX "product_personalization_options_created_at_idx" ON "product_personalization_options" USING btree ("created_at");
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_personalization_options_fk" FOREIGN KEY ("product_personalization_options_id") REFERENCES "public"."product_personalization_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_personalization_options_fk" FOREIGN KEY ("product_personalization_options_id") REFERENCES "public"."product_personalization_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_personalization_opt_fk" FOREIGN KEY ("product_personalization_options_id") REFERENCES "public"."product_personalization_options"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_rels_product_personalization_options_id_idx" ON "products_rels" USING btree ("product_personalization_options_id");
  CREATE INDEX "_products_v_rels_product_personalization_options_id_idx" ON "_products_v_rels" USING btree ("product_personalization_options_id");
  CREATE INDEX "payload_locked_documents_rels_product_personalization_op_idx" ON "payload_locked_documents_rels" USING btree ("product_personalization_options_id");
  ALTER TABLE "variants" DROP COLUMN "custom_field";
  ALTER TABLE "_variants_v" DROP COLUMN "version_custom_field";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_personalization_options" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_personalization_options" CASCADE;
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_product_personalization_options_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_product_personalization_options_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_personalization_opt_fk";
  
  DROP INDEX "products_rels_product_personalization_options_id_idx";
  DROP INDEX "_products_v_rels_product_personalization_options_id_idx";
  DROP INDEX "payload_locked_documents_rels_product_personalization_op_idx";
  ALTER TABLE "variants" ADD COLUMN "custom_field" varchar;
  ALTER TABLE "_variants_v" ADD COLUMN "version_custom_field" varchar;
  ALTER TABLE "products" DROP COLUMN "allow_customization";
  ALTER TABLE "products_rels" DROP COLUMN "product_personalization_options_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_allow_customization";
  ALTER TABLE "_products_v_rels" DROP COLUMN "product_personalization_options_id";
  ALTER TABLE "carts_items" DROP COLUMN "personalization_text";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_personalization_options_id";`)
}
