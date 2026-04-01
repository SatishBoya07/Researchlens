import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  const papersPath = path.join(__dirname, '..', 'src', 'data', 'papers.json');
  const papers = JSON.parse(fs.readFileSync(papersPath, 'utf8'));

  console.log(`Seeding ${papers.length} papers to Supabase...`);

  const { data, error } = await supabase
    .from('papers')
    .upsert(papers, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded database!');
  }
}

seed();
