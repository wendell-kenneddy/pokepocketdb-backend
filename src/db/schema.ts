import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp
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
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const expansionsRelations = relations(expansions, ({ many }) => ({
  cards: many(cards)
}));

export const cards = pgTable("cards", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  category: cardCategoriesEnum("category").notNull(),
  type: pokemonTypesEnum("type"),
  expansionId: text("expansion_id")
    .notNull()
    .references(() => expansions.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const cardsRelations = relations(cards, ({ one }) => ({
  expansion: one(expansions, {
    fields: [cards.expansionId],
    references: [expansions.id]
  })
}));

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
  loserName: text("winner_name").notNull(),
  loserConcede: boolean("loser_concede").notNull(),
  loserPoints: integer("loser_points").notNull(),
  loserEnergies: pokemonTypesEnum("loser_energies").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const matchResultsRelations = relations(matchResults, ({ many }) => ({
  matchWinnerCards: many(matchWinnerCards),
  matchLoserCards: many(matchLoserCards)
}));

export const matchWinnerCards = pgTable("match_winner_cards", {
  id: text("id").primaryKey().$defaultFn(createId),
  matchId: text("match_id")
    .notNull()
    .references(() => matchResults.id),
  cardId: text("card_id")
    .notNull()
    .references(() => cards.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const matchWinnerCardsRelations = relations(
  matchWinnerCards,
  ({ one }) => ({
    card: one(cards, {
      fields: [matchWinnerCards.cardId],
      references: [cards.id]
    })
  })
);

export const matchLoserCards = pgTable("match_loser_cards", {
  id: text("id").primaryKey().$defaultFn(createId),
  matchId: text("match_id")
    .notNull()
    .references(() => matchResults.id),
  cardId: text("card_id")
    .notNull()
    .references(() => cards.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const matchLoserCardsRelations = relations(
  matchLoserCards,
  ({ one }) => ({
    card: one(cards, {
      fields: [matchLoserCards.cardId],
      references: [cards.id]
    })
  })
);
