import { supabase } from '../core/database.js';

export const CadastroPage = {
    async load(userId) {
        // Feedback visual de carregamento
        document.getElementById('inp-nome').value = "Carregando...";
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (data) {
                document.getElementById('inp-nome').value = data.nome_cooperador || '';
                document.getElementById('inp-cidade').value = data.cidade || 'Limeira';
                document.getElementById('inp-comum').value = data.comum_congregacao || '';
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
            document.getElementById('inp-nome').value = "";
        }
    },

    async save(userId) {
        const btn = document.getElementById('btn-save-profile');
        const originalText = btn.innerHTML;
        btn.innerText = "Salvando...";
        btn.disabled = true;

        const updates = {
            id: userId,
            nome_cooperador: document.getElementById('inp-nome').value,
            cidade: document.getElementById('inp-cidade').value,
            comum_congregacao: document.getElementById('inp-comum').value,
            updated_at: new Date()
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        
        btn.innerHTML = originalText;
        btn.disabled = false;

        if (error) alert('Erro: ' + error.message);
        else alert('Dados salvos com sucesso!');
    }
};
