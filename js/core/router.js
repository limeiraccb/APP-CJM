export const Router = {
    pages: ['cadastro', 'recitativos'],

    navigate(pageName) {
        // Esconde todas as páginas
        this.pages.forEach(p => {
            const el = document.getElementById(page-);
            if (el) el.classList.add('hidden');
            
            const btn = document.getElementById(
av-);
            if (btn) {
                btn.classList.remove('bg-blue-800', 'text-white');
                btn.classList.add('hover:bg-slate-800');
            }
        });

        // Mostra a página alvo
        const target = document.getElementById(page-);
        if (target) target.classList.remove('hidden');

        // Ativa o botão no menu
        const activeBtn = document.getElementById(
av-);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-800', 'text-white');
            activeBtn.classList.remove('hover:bg-slate-800');
        }
    }
};
