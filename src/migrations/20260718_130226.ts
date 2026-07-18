import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "occastions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "occastions_id" integer;
  CREATE UNIQUE INDEX "occastions_slug_idx" ON "occastions" USING btree ("slug");
  CREATE INDEX "occastions_updated_at_idx" ON "occastions" USING btree ("updated_at");
  CREATE INDEX "occastions_created_at_idx" ON "occastions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_occastions_fk" FOREIGN KEY ("occastions_id") REFERENCES "public"."occastions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_occastions_id_idx" ON "payload_locked_documents_rels" USING btree ("occastions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "occastions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "occastions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_occastions_fk";
  
  DROP INDEX "payload_locked_documents_rels_occastions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "occastions_id";`)
}
