// Gerenciador da Lógica de Auxiliares
// Responsável por adicionar, remover e renderizar a lista com Nome + Grupo

export const AuxiliarManager = {
    state: {
        homens: [],
        mulheres: []
    },

    // Carrega dados vindos do banco para a memória local
    loadData(homens, mulheres) {
        this.state.homens = homens || [];
        this.state.mulheres = mulheres || [];
        this.render();
    },

    // Retorna os dados para salvar no banco
    getData() {
        return {
            auxiliares_homens: this.state.homens,
            auxiliares_mulheres: this.state.mulheres
        };
    },

    // Adicionar novo auxiliar
    add(type) {
        // Define IDs baseados no tipo (H ou M)
        const nameId = type === 'H' ? 'inp-aux-h-nome' : 'inp-aux-m-nome';
        const groupId = type === 'H' ? 'inp-aux-h-grupo' : 'inp-aux-m-grupo';
        
        const nameInput = document.getElementById(nameId);
        const groupInput = document.getElementById(groupId);
        
        const nome = nameInput.value.trim();
        const grupo = groupInput.value.trim();

        if (!nome || !grupo) {
            alert("Por favor, preencha o Nome e o Grupo.");
            return;
        }

        const novoAuxiliar = { nome, grupo };

        if (type === 'H') this.state.homens.push(novoAuxiliar);
        else this.state.mulheres.push(novoAuxiliar);

        // Limpa campos e foca no nome
        nameInput.value = '';
        groupInput.value = '';
        nameInput.focus();

        this.render();
    },

    // Remover auxiliar
    remove(type, index) {
        if (type === 'H') this.state.homens.splice(index, 1);
        else this.state.mulheres.splice(index, 1);
        this.render();
    },

    // Desenha a lista na tela
    render() {
        this._renderList('list-aux-h', this.state.homens, 'H', 'blue');
        this._renderList('list-aux-m', this.state.mulheres, 'M', 'pink');
    },

    // Função interna auxiliar de renderização
    _renderList(elementId, data, type, color) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = data.map((item, index) => `
            <div class="flex items-center justify-between bg-${color}-50 border border-${color}-100 p-2 rounded mb-2 text-sm group hover:shadow-sm transition">
                <div class="flex flex-col">
                    <span class="font-bold text-slate-700">${item.nome}</span>
                    <span class="text-xs text-${color}-600 font-semibold uppercase">${item.grupo}</span>
                </div>
                <button id="btn-remove-${type}-${index}" class="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Reatribuir eventos de delete (já que recriamos o HTML)
        data.forEach((_, index) => {
            document.getElementById(`btn-remove-${type}-${index}`).onclick = () => this.remove(type, index);
        });
    }
};