import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "carts" ADD COLUMN "shipping_method_id" integer;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_shipping_method_id_shipping_methods_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_methods"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "carts_shipping_method_idx" ON "carts" USING btree ("shipping_method_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "carts" DROP CONSTRAINT "carts_shipping_method_id_shipping_methods_id_fk";
  
  DROP INDEX "carts_shipping_method_idx";
  ALTER TABLE "carts" DROP COLUMN "shipping_method_id";`)
}
