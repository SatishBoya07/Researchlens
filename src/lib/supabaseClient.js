import { createClient } from '@supabase/supabase-js';
import fallbackPapers from '../data/papers.json'; // Cache burst pulse: 1

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const HAS_SUPABASE = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = HAS_SUPABASE 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Service to get all papers. Uses Supabase if configured, otherwise falls back to local JSON.
 */
export async function getAllPapers() {
  if (HAS_SUPABASE && supabase) {
    const { data, error } = await supabase.from('papers').select('*');
    if (error) {
      console.error("Supabase Error:", error);
      return fallbackPapers;
    }
    return data;
  }
  
  // Simulated network delay
  await new Promise(r => setTimeout(r, 200));
  return fallbackPapers;
}

/**
 * Service to get a paper by ID. Uses Supabase if configured, otherwise falls back to local JSON.
 */
export async function getPaperById(id) {
  if (HAS_SUPABASE && supabase) {
    const { data, error } = await supabase.from('papers').select('*').eq('id', id).single();
    if (error) {
      console.error("Supabase Error:", error);
      return fallbackPapers.find(p => p.id === id);
    }
    return data;
  }
  
  // Simulated network delay
  await new Promise(r => setTimeout(r, 200));
  return fallbackPapers.find(p => p.id === id);
}
