export const Router = {
    pages: ['cadastro', 'recitativos'],

    navigate(pageName) {
        // Esconde todas as páginas
        this.pages.forEach(p => {
            // CORREÇÃO: Usando ' + ' em vez de crase para evitar erro
            const el = document.getElementById('page-' + p);
            if (el) el.classList.add('hidden');
            
            const btn = document.getElementById('nav-' + p);
            if (btn) {
                btn.classList.remove('bg-blue-800', 'text-white');
                btn.classList.add('hover:bg-slate-800');
            }
        });

        // Mostra a página alvo
        const target = document.getElementById('page-' + pageName);
        if (target) target.classList.remove('hidden');

        // Ativa o botão no menu
        const activeBtn = document.getElementById('nav-' + pageName);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-800', 'text-white');
            activeBtn.classList.remove('hover:bg-slate-800');
        }
    }
};