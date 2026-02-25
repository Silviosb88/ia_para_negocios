/**
 * Clube do Foco - GitHub OAuth Authentication
 * Gerencia autenticação com GitHub e armazenamento de usuário
 */

// ============================================
// Configuração OAuth
// ============================================

const GITHUB_CLIENT_ID = 'Ov23li37h0OtTvWefpFQ';
const GITHUB_REDIRECT_URI = window.location.origin + '/callback.html';
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

// ============================================
// Objeto de Autenticação
// ============================================

const auth = {
  /**
   * Obter URL de login do GitHub
   */
  getLoginUrl: function() {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'user:email',
      state: this.generateState()
    });
    return `${GITHUB_AUTH_URL}?${params.toString()}`;
  },

  /**
   * Gerar estado aleatório para segurança
   */
  generateState: function() {
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated: function() {
    const user = this.getCurrentUser();
    return user !== null;
  },

  /**
   * Obter usuário atual
   */
  getCurrentUser: function() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Erro ao obter usuário:', e);
      return null;
    }
  },

  /**
   * Salvar usuário após autenticação
   */
  setCurrentUser: function(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token || '');
      localStorage.setItem('login_time', new Date().toISOString());
      // Disparar evento de login
      window.dispatchEvent(new CustomEvent('auth:login', { detail: userData }));
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
    }
  },

  /**
   * Fazer logout com confirmação
   */
  logout: function() {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('login_time');
      // Disparar evento de logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
      window.location.href = '/';
    }
  },

  /**
   * Obter token de autenticação
   */
  getToken: function() {
    return localStorage.getItem('token');
  },

  /**
   * Verificar se token é válido
   */
  isTokenValid: function() {
    const token = this.getToken();
    const loginTime = localStorage.getItem('login_time');
    
    if (!token || !loginTime) return false;

    // Token válido por 24 horas
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
  },

  /**
   * Processar callback do GitHub
   */
  handleCallback: function(code, state) {
    // Verificar estado para segurança
    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
      console.error('Estado inválido - possível ataque CSRF');
      return false;
    }

    // Aqui você faria uma chamada ao backend para trocar o código por um token
    // Por enquanto, vamos simular um usuário autenticado
    const userData = {
      id: Math.random().toString(36).substring(7),
      login: 'usuario_' + Math.random().toString(36).substring(7),
      name: 'Usuário do Clube do Foco',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      email: 'usuario@clubedofoco.ia.br',
      token: 'token_' + Math.random().toString(36).substring(7),
      role: 'user'
    };

    this.setCurrentUser(userData);
    return true;
  },

  /**
   * Renderizar botão de login/logout
   */
  renderAuthButton: function(container) {
    if (!container) return;

    const user = this.getCurrentUser();
    
    if (user) {
      // Usuário autenticado - mostrar logout
      container.innerHTML = `
        <div class="auth-user" style="display: flex; align-items: center; gap: 12px; margin-left: 1rem;">
          <img src="${user.avatar_url}" alt="${user.name}" class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff;">
          <span class="user-name" style="color: white; font-size: 14px; font-weight: 500;">${user.name}</span>
          <button class="btn-logout" onclick="auth.logout()" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.3s ease;">🚪 Sair</button>
        </div>
      `;
      
      // Adicionar hover effect
      const btn = container.querySelector('.btn-logout');
      if (btn) {
        btn.addEventListener('mouseover', function() {
          this.style.background = '#dc2626';
        });
        btn.addEventListener('mouseout', function() {
          this.style.background = '#ef4444';
        });
      }
    } else {
      // Não autenticado - mostrar login
      container.innerHTML = `
        <a href="${this.getLoginUrl()}" class="btn-login" style="display: inline-block; padding: 8px 16px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: background 0.3s ease;">
          🔐 Login com GitHub
        </a>
      `;
      
      // Adicionar hover effect
      const link = container.querySelector('.btn-login');
      if (link) {
        link.addEventListener('mouseover', function() {
          this.style.background = '#4f46e5';
        });
        link.addEventListener('mouseout', function() {
          this.style.background = '#6366f1';
        });
      }
    }
  },

  /**
   * Proteger página - redirecionar se não autenticado
   */
  requireAuth: function(redirectTo = '/') {
    if (!this.isAuthenticated()) {
      // Salvar página atual para redirecionar após login
      localStorage.setItem('redirect_after_login', window.location.pathname);
      window.location.href = this.getLoginUrl();
      return false;
    }
    return true;
  }
};

// ============================================
// Inicialização
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Renderizar botão de autenticação se existir elemento
  const authContainer = document.getElementById('auth-container');
  if (authContainer) {
    auth.renderAuthButton(authContainer);
  }

  // Verificar se estamos na página de callback
  if (window.location.pathname === '/callback.html') {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code && state) {
      auth.handleCallback(code, state);
      // Redirecionar para página anterior ou home
      const redirectTo = localStorage.getItem('redirect_after_login') || '/';
      localStorage.removeItem('redirect_after_login');
      window.location.href = redirectTo;
    }
  }

  // Listener para mudanças de autenticação
  window.addEventListener('auth:login', function(e) {
    console.log('✅ Usuário autenticado:', e.detail.name);
  });

  window.addEventListener('auth:logout', function() {
    console.log('❌ Usuário desconectado');
  });
});

// ============================================
// Exportar para uso global
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = auth;
}
