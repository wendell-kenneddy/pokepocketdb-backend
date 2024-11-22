import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

export const pokemonTypesEnum = pgEnum("card_types", [
  "colorless",
  "fire",
  "water",
  "grass",
  "fighting",
  "metal",
  "psychic",
  "darkness",
  "lightning",
  "dragon"
]);

export const cardCategoriesEnum = pgEnum("card_categories", [
  "pokemon",
  "item",
  "support"
]);

export const expansions = pgTable("expansions", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const cards = pgTable(
  "cards",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    name: text("name").notNull(),
    category: cardCategoriesEnum("category").notNull(),
    type: pokemonTypesEnum("type"),
    expansionId: text("expansion_id")
      .notNull()
      .references(() => expansions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
  },
  (t) => ({
    unq: unique().on(t.name, t.expansionId)
  })
);

export const matchResults = pgTable("match_results", {
  id: text("id").primaryKey().$defaultFn(createId),
  turns: integer("turns").notNull(),
  winnerComeback: boolean("winner_comeback").notNull(),
  winnerName: text("winner_name").notNull(),
  winnerPoints: integer("winner_points").notNull(),
  winnerCoinFirst: boolean("winner_coin_first").notNull(),
  winnerTypeAdvantage: boolean("winner_type_advantage").notNull(),
  winnerTypeDisadvantage: boolean("winner_type_disadvantage").notNull(),
  winnerEnergies: pokemonTypesEnum("winner_energies").array().notNull(),
  winnerLevel: integer("winner_level").notNull(),
  loserLevel: integer("loser_level").notNull(),
  loserName: text("loser_name").notNull(),
  loserConcede: boolean("loser_concede").notNull(),
  loserPoints: integer("loser_points").notNull(),
  loserEnergies: pokemonTypesEnum("loser_energies").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const matchCards = pgTable("match_cards", {
  id: text("id").primaryKey().$defaultFn(createId),
  matchId: text("match_id")
    .notNull()
    .references(() => matchResults.id, { onDelete: "cascade" }),
  cardId: text("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  winnerCard: boolean("winner_card").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
