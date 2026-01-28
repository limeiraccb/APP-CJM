import { supabase } from '../core/database.js';
import { AuxiliarManager } from '../components/auxiliares.js';

export const CadastroPage = {
    async load(userId) {
        const loadingMsg = "Carregando...";
        document.getElementById('inp-nome').value = loadingMsg;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (data) {
                // Dados Básicos
                document.getElementById('inp-nome').value = data.nome_cooperador || '';
                document.getElementById('inp-cidade').value = data.cidade || 'Limeira';
                document.getElementById('inp-comum').value = data.comum_congregacao || '';
                document.getElementById('inp-data').value = data.data_apresentacao || '';
                
                // Liderança
                document.getElementById('inp-anciao').value = data.nome_anciao || '';
                document.getElementById('inp-coop-oficio').value = data.nome_coop_oficio || '';
                document.getElementById('inp-diacono').value = data.nome_diacono || '';

                // Carregar Auxiliares no Componente
                AuxiliarManager.loadData(data.auxiliares_homens, data.auxiliares_mulheres);
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
            document.getElementById('inp-nome').value = "";
        }
    },

    async save(userId) {
        const btn = document.getElementById('btn-save-profile');
        const originalText = btn.innerHTML;
        
        // Feedback Visual
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Salvando...';
        btn.disabled = true;
        btn.classList.add('opacity-75');

        // Pega os dados dos auxiliares do componente
        const auxiliaresData = AuxiliarManager.getData();

        const updates = {
            id: userId,
            nome_cooperador: document.getElementById('inp-nome').value,
            cidade: document.getElementById('inp-cidade').value,
            comum_congregacao: document.getElementById('inp-comum').value,
            data_apresentacao: document.getElementById('inp-data').value || null,
            
            nome_anciao: document.getElementById('inp-anciao').value,
            nome_coop_oficio: document.getElementById('inp-coop-oficio').value,
            nome_diacono: document.getElementById('inp-diacono').value,

            // Novos campos JSON
            auxiliares_homens: auxiliaresData.auxiliares_homens,
            auxiliares_mulheres: auxiliaresData.auxiliares_mulheres,
            
            updated_at: new Date() // Corrigido erro do schema
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        
        // Restaura botão
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75');

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            // Feedback sutil de sucesso
            const originalColor = btn.className;
            btn.className = "bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg flex items-center";
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Sucesso!';
            setTimeout(() => {
                btn.className = originalColor;
                btn.innerHTML = originalText;
            }, 2000);
        }
    },

    // Método para inicializar eventos específicos desta página
    setupEvents() {
        document.getElementById('btn-add-aux-h').onclick = () => AuxiliarManager.add('H');
        document.getElementById('btn-add-aux-m').onclick = () => AuxiliarManager.add('M');
    }
};