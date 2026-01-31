import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import 'dotenv/config';
import { eq } from 'drizzle-orm';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// GET: All countries
app.get('/api/countries', async (req, res) => {
    try {
        const allCountries = await db.select().from(schema.countries);
        res.json(allCountries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// POST: Sync/Update all countries
app.post('/api/countries/sync', async (req, res) => {
    const { countries } = req.body;
    if (!Array.isArray(countries)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        // Basic approach: delete and re-insert for a full sync 
        // or use upsert logic. Upsert is safer.

        for (const country of countries) {
            await db.insert(schema.countries)
                .values({
                    id: country.id,
                    name: country.name,
                    flag: country.flag,
                    victorias: country.victorias,
                    empates: country.empates,
                    derrotas: country.derrotas,
                    generadores: country.generadores,
                    ganchos: country.ganchos,
                    primerosCuelgues: country.primerosCuelgues,
                    muertes: country.muertes,
                    generadoresEnemigos: country.generadoresEnemigos,
                    updatedAt: new Date(),
                })
                .onConflictDoUpdate({
                    target: schema.countries.id,
                    set: {
                        name: country.name,
                        flag: country.flag,
                        victorias: country.victorias,
                        empates: country.empates,
                        derrotas: country.derrotas,
                        generadores: country.generadores,
                        ganchos: country.ganchos,
                        primerosCuelgues: country.primerosCuelgues,
                        muertes: country.muertes,
                        generadoresEnemigos: country.generadoresEnemigos,
                        updatedAt: new Date(),
                    }
                });
        }

        res.json({ message: 'Sync successful' });
    } catch (error) {
        console.error('Error syncing:', error);
        res.status(500).json({ error: 'Failed to sync results' });
    }
});

// DELETE: Remove country
app.delete('/api/countries/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.delete(schema.countries).where(eq(schema.countries.id, id));
        res.json({ message: 'Country removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove country' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Admin API running at http://localhost:${port}`);
});
