import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "rent_carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rentable_id" integer
  );
  
  CREATE TABLE "rent_carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_product_id_rentables_id_fk";
  
  DROP INDEX "inquiries_product_idx";
  ALTER TABLE "inquiries" ALTER COLUMN "user_id" DROP NOT NULL;
  ALTER TABLE "inquiries" ADD COLUMN "rent_cart_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rent_carts_id" integer;
  ALTER TABLE "rent_carts_items" ADD CONSTRAINT "rent_carts_items_rentable_id_rentables_id_fk" FOREIGN KEY ("rentable_id") REFERENCES "public"."rentables"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rent_carts_items" ADD CONSTRAINT "rent_carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rent_carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rent_carts" ADD CONSTRAINT "rent_carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "rent_carts_items_order_idx" ON "rent_carts_items" USING btree ("_order");
  CREATE INDEX "rent_carts_items_parent_id_idx" ON "rent_carts_items" USING btree ("_parent_id");
  CREATE INDEX "rent_carts_items_rentable_idx" ON "rent_carts_items" USING btree ("rentable_id");
  CREATE INDEX "rent_carts_customer_idx" ON "rent_carts" USING btree ("customer_id");
  CREATE INDEX "rent_carts_updated_at_idx" ON "rent_carts" USING btree ("updated_at");
  CREATE INDEX "rent_carts_created_at_idx" ON "rent_carts" USING btree ("created_at");
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_rent_cart_id_rent_carts_id_fk" FOREIGN KEY ("rent_cart_id") REFERENCES "public"."rent_carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rent_carts_fk" FOREIGN KEY ("rent_carts_id") REFERENCES "public"."rent_carts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_rent_cart_idx" ON "inquiries" USING btree ("rent_cart_id");
  CREATE INDEX "payload_locked_documents_rels_rent_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("rent_carts_id");
  ALTER TABLE "inquiries" DROP COLUMN "product_id";
  ALTER TABLE "inquiries" DROP COLUMN "status";
  DROP TYPE "public"."enum_inquiries_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_status" AS ENUM('pending', 'active', 'completed', 'cancelled');
  ALTER TABLE "rent_carts_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rent_carts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rent_carts_items" CASCADE;
  DROP TABLE "rent_carts" CASCADE;
  ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_rent_cart_id_rent_carts_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rent_carts_fk";
  
  DROP INDEX "inquiries_rent_cart_idx";
  DROP INDEX "payload_locked_documents_rels_rent_carts_id_idx";
  ALTER TABLE "inquiries" ALTER COLUMN "user_id" SET NOT NULL;
  ALTER TABLE "inquiries" ADD COLUMN "product_id" integer NOT NULL;
  ALTER TABLE "inquiries" ADD COLUMN "status" "enum_inquiries_status" DEFAULT 'pending';
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_id_rentables_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."rentables"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "inquiries_product_idx" ON "inquiries" USING btree ("product_id");
  ALTER TABLE "inquiries" DROP COLUMN "rent_cart_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rent_carts_id";`)
}
