import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("applications",(table) => {
        table.increments("id").primary();

        table
        .integer("tender_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("tenders")
        .onDelete("CASCADE");

        table
        .integer("company_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("companies")
        .onDelete("CASCADE");

        table.text("message");
        table.decimal("budget", 12, 2).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());

        table.unique(["tender_id", "company_id"]);
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("applications");
}
