import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
    id: text('id').primaryKey(), // We'll keep using the ID string
    name: text('name').notNull(),
    flag: text('flag').notNull(),
    victorias: integer('victorias').default(0).notNull(),
    empates: integer('empates').default(0).notNull(),
    derrotas: integer('derrotas').default(0).notNull(),
    generadores: integer('generadores').default(0).notNull(),
    ganchos: integer('ganchos').default(0).notNull(),
    primerosCuelgues: integer('primeros_cuelgues').default(0).notNull(),
    muertes: integer('muertes').default(0).notNull(),
    generadoresEnemigos: integer('generadores_enemigos').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
