import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_numbered_lists_lists_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"paragraph" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_lists_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_lists_lists_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"paragraph" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_lists_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_numbered_lists_lists_points" ADD CONSTRAINT "pages_blocks_numbered_lists_lists_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_numbered_lists_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_lists_lists" ADD CONSTRAINT "pages_blocks_numbered_lists_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_numbered_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_lists" ADD CONSTRAINT "pages_blocks_numbered_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_lists_lists_points" ADD CONSTRAINT "_pages_v_blocks_numbered_lists_lists_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_numbered_lists_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_lists_lists" ADD CONSTRAINT "_pages_v_blocks_numbered_lists_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_numbered_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_lists" ADD CONSTRAINT "_pages_v_blocks_numbered_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_numbered_lists_lists_points_order_idx" ON "pages_blocks_numbered_lists_lists_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_lists_lists_points_parent_id_idx" ON "pages_blocks_numbered_lists_lists_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_lists_lists_order_idx" ON "pages_blocks_numbered_lists_lists" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_lists_lists_parent_id_idx" ON "pages_blocks_numbered_lists_lists" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_lists_order_idx" ON "pages_blocks_numbered_lists" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_lists_parent_id_idx" ON "pages_blocks_numbered_lists" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_lists_path_idx" ON "pages_blocks_numbered_lists" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_numbered_lists_lists_points_order_idx" ON "_pages_v_blocks_numbered_lists_lists_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_lists_lists_points_parent_id_idx" ON "_pages_v_blocks_numbered_lists_lists_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_lists_lists_order_idx" ON "_pages_v_blocks_numbered_lists_lists" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_lists_lists_parent_id_idx" ON "_pages_v_blocks_numbered_lists_lists" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_lists_order_idx" ON "_pages_v_blocks_numbered_lists" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_lists_parent_id_idx" ON "_pages_v_blocks_numbered_lists" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_lists_path_idx" ON "_pages_v_blocks_numbered_lists" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_numbered_lists_lists_points" CASCADE;
  DROP TABLE "pages_blocks_numbered_lists_lists" CASCADE;
  DROP TABLE "pages_blocks_numbered_lists" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_lists_lists_points" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_lists_lists" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_lists" CASCADE;`)
}
