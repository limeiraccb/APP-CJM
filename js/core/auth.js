import { supabase } from './database.js';

export const AuthSystem = {
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async logout() {
        await supabase.auth.signOut();
        window.location.reload();
    },

    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }
};
