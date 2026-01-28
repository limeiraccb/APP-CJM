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
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
}

// --- EVENT LISTENERS ---

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const msg = document.getElementById('auth-msg');
    
    msg.innerText = "Conectando...";
    
    try {
        await AuthSystem.login(email, pass);
        // O reload acontece dentro do auth.js, mas se passar:
        window.location.reload();
    } catch (error) {
        msg.innerText = "Erro: " + error.message;
    }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => AuthSystem.logout());

// Navegação
document.getElementById('nav-cadastro').addEventListener('click', () => {
    Router.navigate('cadastro');
    if(currentUser) CadastroPage.load(currentUser.id);
});

document.getElementById('nav-recitativos').addEventListener('click', () => {
    Router.navigate('recitativos');
    RecitativosPage.init();
});

// Ações Específicas
document.getElementById('btn-save-profile').addEventListener('click', () => {
    if(currentUser) CadastroPage.save(currentUser.id);
});

// Start
initApp();
