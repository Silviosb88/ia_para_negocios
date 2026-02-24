/**
 * GitHub OAuth Authentication
 * Clube do Foco - MBA IA para Negócios
 * 
 * Este arquivo implementa autenticação com GitHub OAuth
 * Permite que estudantes façam login com suas contas GitHub
 */

const GITHUB_CLIENT_ID = 'Ov23li37h0OtTvWefpFQ';
const GITHUB_REDIRECT_URI = window.location.origin + '/auth/callback.html';
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

/**
 * Redireciona o usuário para a página de login do GitHub
 */
function loginWithGitHub() {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'user:email',
    allow_signup: 'true'
  });
  
  window.location.href = `${GITHUB_AUTH_URL}?${params.toString()}`;
}

/**
 * Obtém o código de autorização da URL
 */
function getAuthCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
}

/**
 * Armazena informações do usuário no localStorage
 */
function saveUserSession(user) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('loginTime', new Date().getTime());
}

/**
 * Recupera informações do usuário do localStorage
 */
function getUserSession() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Verifica se o usuário está autenticado
 */
function isAuthenticated() {
  return getUserSession() !== null;
}

/**
 * Faz logout do usuário
 */
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  window.location.href = '/';
}

/**
 * Atualiza o menu com informações do usuário
 */
function updateMenuWithUser() {
  const user = getUserSession();
  const navMenu = document.querySelector('.top-nav ul');
  
  if (user && navMenu) {
    // Remove botão de login se existir
    const existingLoginBtn = document.getElementById('login-btn');
    if (existingLoginBtn) {
      existingLoginBtn.remove();
    }
    
    // Adiciona menu de usuário
    const userMenuHTML = `
      <li class="dropdown" id="user-menu">
        <a href="#"><i class="fas fa-user-circle"></i> ${user.login} <i class="fas fa-caret-down"></i></a>
        <div class="dropdown-content">
          <a href="/profile.html"><i class="fas fa-user"></i> Meu Perfil</a>
          <a href="/my-uploads.html"><i class="fas fa-upload"></i> Meus Uploads</a>
          <a href="#" onclick="logout(); return false;"><i class="fas fa-sign-out-alt"></i> Sair</a>
        </div>
      </li>
    `;
    
    navMenu.insertAdjacentHTML('beforeend', userMenuHTML);
  } else if (!user && navMenu) {
    // Remove menu de usuário se existir
    const existingUserMenu = document.getElementById('user-menu');
    if (existingUserMenu) {
      existingUserMenu.remove();
    }
    
    // Adiciona botão de login
    if (!document.getElementById('login-btn')) {
      const loginBtnHTML = `
        <li id="login-btn">
          <a href="#" onclick="loginWithGitHub(); return false;" style="background: #6366f1;">
            <i class="fas fa-sign-in-alt"></i> Login com GitHub
          </a>
        </li>
      `;
      
      navMenu.insertAdjacentHTML('beforeend', loginBtnHTML);
    }
  }
}

/**
 * Protege páginas que requerem autenticação
 */
function protectPage() {
  if (!isAuthenticated()) {
    // Redireciona para página de login
    window.location.href = '/login.html';
  }
}

/**
 * Inicializa a autenticação quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function() {
  updateMenuWithUser();
  
  // Se estiver na página de callback, processa o código
  if (window.location.pathname.includes('callback')) {
    const code = getAuthCode();
    if (code) {
      // Armazena o código para ser processado pelo backend
      localStorage.setItem('authCode', code);
      // Aqui você precisaria de um backend para trocar o código por um token
      // Por enquanto, vamos simular um usuário
      console.log('Código de autorização recebido:', code);
    }
  }
});

/**
 * Simula um usuário autenticado (para testes)
 * Em produção, isso viria do backend após validar o token do GitHub
 */
function simulateLogin(username) {
  const user = {
    login: username,
    id: Math.random(),
    avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000000)}?v=4`,
    html_url: `https://github.com/${username}`
  };
  saveUserSession(user);
  updateMenuWithUser();
}
