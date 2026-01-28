import { supabase } from '../core/database.js';

export const RecitativosPage = {
    userId: null,

    init(user) {
        this.userId = user.id;
        console.log("Recitativos: Iniciado para", user.email);
        this.loadHistory();
        this.setupEvents();
    },

    setupEvents() {
        // Botão Novo Relatório
        const btnNew = document.getElementById('btn-new-recitativo');
        if (btnNew) btnNew.onclick = () => this.openModal();

        // Botões do Modal
        const btnCancel = document.getElementById('btn-cancel-rec');
        if (btnCancel) btnCancel.onclick = () => this.closeModal();

        const btnConfirm = document.getElementById('btn-confirm-rec');
        if (btnConfirm) btnConfirm.onclick = () => this.save();

        // Cálculo Automático no Modal
        const inputs = document.querySelectorAll('.rec-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateTotal());
        });
    },

    async loadHistory() {
        const tableBody = document.getElementById('table-recitativos');
        tableBody.innerHTML = '<tr><td colspan="9" class="p-4 text-center text-gray-400">Carregando histórico...</td></tr>';

        const { data, error } = await supabase
            .from('recitativos')
            .select('*')
            .order('data_relatorio', { ascending: false });

        if (error) {
            console.error(error);
            tableBody.innerHTML = '<tr><td colspan="9" class="p-4 text-center text-red-500">Erro ao carregar dados.</td></tr>';
            return;
        }

        this.renderTable(data);
    },

    renderTable(data) {
        const tableBody = document.getElementById('table-recitativos');
        
        // Totais Gerais
        let totalM = 0, totalF = 0;

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 bg-slate-50 rounded-lg">Nenhum relatório lançado ainda.</td></tr>';
            this.updateStats(0, 0);
            return;
        }

        tableBody.innerHTML = data.map(row => {
            const subM = (row.qtd_criancas_ler_m || 0) + (row.qtd_meninos || 0) + (row.qtd_mocos || 0);
            const subF = (row.qtd_criancas_ler_f || 0) + (row.qtd_meninas || 0) + (row.qtd_mocas || 0);
            const total = subM + subF;

            totalM += subM;
            totalF += subF;

            // Formatação da Data (Evita o problema de fuso horário UTC)
            const dateParts = row.data_relatorio.split('-');
            const dateDisplay = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            return `
                <tr class="hover:bg-slate-50 border-b border-slate-100 transition">
                    <td class="p-4 font-bold text-slate-700">${dateDisplay}</td>
                    <td class="p-4 text-center text-gray-600">${row.qtd_criancas_ler_m}</td>
                    <td class="p-4 text-center text-gray-600">${row.qtd_meninos}</td>
                    <td class="p-4 text-center text-gray-600 border-r border-slate-100">${row.qtd_mocos}</td>
                    <td class="p-4 text-center text-gray-600">${row.qtd_criancas_ler_f}</td>
                    <td class="p-4 text-center text-gray-600">${row.qtd_meninas}</td>
                    <td class="p-4 text-center text-gray-600 border-r border-slate-100">${row.qtd_mocas}</td>
                    <td class="p-4 text-center font-extrabold text-blue-900 bg-blue-50/30">${total}</td>
                    <td class="p-4 text-right">
                        <button onclick="window.deleteRecitativo('${row.id}')" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateStats(totalM, totalF);
        
        // Hack para o delete funcionar no módulo (expondo para o window)
        window.deleteRecitativo = (id) => this.delete(id);
    },

    updateStats(m, f) {
        document.getElementById('stat-rec-m').innerText = m;
        document.getElementById('stat-rec-f').innerText = f;
        document.getElementById('stat-rec-total').innerText = m + f;
    },

    // --- MODAL & FORM ---

    openModal() {
        document.getElementById('modal-recitativo').classList.remove('hidden');
        document.getElementById('rec-modal-date').valueAsDate = new Date();
        this.resetForm();
    },

    closeModal() {
        document.getElementById('modal-recitativo').classList.add('hidden');
    },

    resetForm() {
        const inputs = document.querySelectorAll('.rec-input');
        inputs.forEach(i => i.value = 0);
        this.calculateTotal();
    },

    calculateTotal() {
        let sum = 0;
        document.querySelectorAll('.rec-input').forEach(i => {
            sum += parseInt(i.value || 0);
        });
        document.getElementById('rec-modal-total').innerText = sum;
    },

    async save() {
        const btn = document.getElementById('btn-confirm-rec');
        const originalText = btn.innerHTML;
        btn.innerText = "Salvando...";
        btn.disabled = true;

        const dataRelatorio = document.getElementById('rec-modal-date').value;
        if (!dataRelatorio) {
            alert("Selecione a data!");
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        const payload = {
            user_id: this.userId,
            data_relatorio: dataRelatorio,
            qtd_criancas_ler_m: parseInt(document.getElementById('rec-inp-m-nler').value) || 0,
            qtd_meninos: parseInt(document.getElementById('rec-inp-m').value) || 0,
            qtd_mocos: parseInt(document.getElementById('rec-inp-mocos').value) || 0,
            qtd_criancas_ler_f: parseInt(document.getElementById('rec-inp-f-nler').value) || 0,
            qtd_meninas: parseInt(document.getElementById('rec-inp-f').value) || 0,
            qtd_mocas: parseInt(document.getElementById('rec-inp-mocas').value) || 0
        };

        const { error } = await supabase.from('recitativos').insert(payload);

        btn.innerHTML = originalText;
        btn.disabled = false;

        if (error) {
            alert("Erro ao salvar: " + error.message);
        } else {
            this.closeModal();
            this.loadHistory();
        }
    },

    async delete(id) {
        if (!confirm("Deseja realmente excluir este lançamento?")) return;
        const { error } = await supabase.from('recitativos').delete().eq('id', id);
        
        if (error) alert("Erro ao excluir: " + error.message);
        else this.loadHistory();
    }
};