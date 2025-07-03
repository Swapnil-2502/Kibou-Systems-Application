import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tenders", (table) => {
    table.increments("id").primary();
    table
      .integer("company_id")
      .unsigned()
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");
    table.string("title").notNullable();
    table.text("description");
    table.date("deadline").notNullable();
    table.decimal("budget", 12, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tenders");
}
