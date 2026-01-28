import { CONFIG } from '../config/env.js';

if (!window.supabase) {
    console.error("Supabase SDK não carregado. Verifique o index.html.");
    throw new Error("Supabase SDK Missing");
}

export const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
