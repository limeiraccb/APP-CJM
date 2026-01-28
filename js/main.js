import { AuthSystem } from './core/auth.js';
import { Router } from './core/router.js';
import { CadastroPage } from './pages/cadastro.js';
import { RecitativosPage } from './pages/recitativos.js';

let currentUser = null;

// --- INICIALIZAÇÃO ---
async function initApp() {
    const session = await AuthSystem.getSession();
    
    if (session) {
        currentUser = session.user;
        
        // UI Updates
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('sidebar').classList.remove('hidden');
        document.getElementById('sidebar').classList.add('flex');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = currentUser.email;
        
        // Iniciar na tela de cadastro
        Router.navigate('cadastro');
        CadastroPage.load(currentUser.id);
        CadastroPage.setupEvents(); 
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
}

// --- EVENT LISTENERS (Menu e Sistema) ---

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const msg = document.getElementById('auth-msg');
    
    msg.innerText = "Conectando...";
    
    try {
        await AuthSystem.login(email, pass);
        window.location.reload();
    } catch (error) {
        msg.innerText = "Erro: " + error.message;
    }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => AuthSystem.logout());

// Navegação - Cadastro
document.getElementById('nav-cadastro').addEventListener('click', () => {
    Router.navigate('cadastro');
    if(currentUser) {
        CadastroPage.load(currentUser.id);
        CadastroPage.setupEvents();
    }
});

// Navegação - Recitativos
document.getElementById('nav-recitativos').addEventListener('click', () => {
    Router.navigate('recitativos');
    // Passamos o usuário atual para a página saber de quem carregar
    if(currentUser) {
        RecitativosPage.init(currentUser);
    }
});

// Botão Salvar Geral (Cadastro)
document.getElementById('btn-save-profile').addEventListener('click', () => {
    if(currentUser) CadastroPage.save(currentUser.id);
});

// Iniciar Aplicação
initApp();