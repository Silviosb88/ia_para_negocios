permissions.js
/**
 * Sistema de Roles e Permissões
 * Gerencia autenticação, roles (user/admin) e verificação de permissões
 * 
 * Uso:
 * - protectPage('user') - Protege página para usuários logados
 * - protectPage('admin') - Protege página para admins
 * - isAuthenticated() - Verifica se está logado
 * - hasRole('admin') - Verifica se tem role específico
 * - getCurrentUser() - Retorna dados do usuário
 */

// ============================================
// 1. GERENCIAMENTO DE USUÁRIO
// ============================================

/**
 * Salva dados do usuário no localStorage
 * Chamado após login bem-sucedido
 */
function saveUser(userData) {
  // userData deve ter: id, name, email, avatar, role
  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar,
    role: userData.role || 'user', // Default: user
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
  
  console.log('✅ Usuário salvo:', user.name, `(${user.role})`);
  return user;
}

/**
 * Obtém dados do usuário atual
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('❌ Erro ao parsear usuário:', e);
    return null;
  }
}

/**
 * Remove usuário do localStorage (logout)
 */
function clearUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  console.log('✅ Usuário desconectado');
}

// ============================================
// 2. VERIFICAÇÃO DE AUTENTICAÇÃO
// ============================================

/**
 * Verifica se o usuário está autenticado
 */
function isAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true' && getCurrentUser() !== null;
}

/**
 * Verifica se o usuário NÃO está autenticado
 */
function isNotAuthenticated() {
  return !isAuthenticated();
}

// ============================================
// 3. VERIFICAÇÃO DE ROLES
// ============================================

/**
 * Verifica se o usuário tem um role específico
 * @param {string} requiredRole - Role a verificar ('user', 'admin')
 */
function hasRole(requiredRole) {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Verifica se o usuário é admin
 */
function isAdmin() {
  return hasRole('admin');
}

/**
 * Verifica se o usuário é um usuário comum (não admin)
 */
function isRegularUser() {
  return hasRole('user');
}

/**
 * Verifica se o usuário tem uma das roles especificadas
 * @param {array} roles - Array de roles permitidas
 */
function hasAnyRole(roles) {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Verifica se o usuário tem todas as roles especificadas
 * @param {array} roles - Array de roles necessárias
 */
function hasAllRoles(roles) {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.every(role => user.role === role);
}

// ============================================
// 4. PROTEÇÃO DE PÁGINAS
// ============================================

/**
 * Protege uma página verificando autenticação e role
 * Se não tiver permissão, redireciona para login ou dashboard
 * 
 * @param {string} requiredRole - Role necessária ('user', 'admin')
 * @returns {boolean} - true se tem permissão, false caso contrário
 */
function protectPage(requiredRole = 'user') {
  // Verificar autenticação
  if (!isAuthenticated()) {
    console.warn('⚠️ Acesso negado: usuário não autenticado');
    redirectToLogin();
    return false;
  }
  
  // Verificar role
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(`⚠️ Acesso negado: role necessária é "${requiredRole}"`);
    redirectToDashboard();
    return false;
  }
  
  console.log('✅ Acesso permitido');
  return true;
}

/**
 * Versão assíncrona de protectPage (para uso em async/await)
 */
async function protectPageAsync(requiredRole = 'user') {
  return new Promise((resolve) => {
    if (!isAuthenticated()) {
      console.warn('⚠️ Acesso negado: usuário não autenticado');
      redirectToLogin();
      resolve(false);
    } else if (requiredRole && !hasRole(requiredRole)) {
      console.warn(`⚠️ Acesso negado: role necessária é "${requiredRole}"`);
      redirectToDashboard();
      resolve(false);
    } else {
      console.log('✅ Acesso permitido');
      resolve(true);
    }
  });
}

// ============================================
// 5. REDIRECIONAMENTOS
// ============================================

/**
 * Redireciona para página de login
 */
function redirectToLogin() {
  console.log('🔄 Redirecionando para login...');
  window.location.href = '/login.html';
}

/**
 * Redireciona para dashboard
 */
function redirectToDashboard() {
  console.log('🔄 Redirecionando para dashboard...');
  window.location.href = '/dashboard.html';
}

/**
 * Redireciona para página de acesso negado
 */
function redirectToAccessDenied() {
  console.log('🔄 Redirecionando para acesso negado...');
  window.location.href = '/access-denied.html';
}

/**
 * Redireciona para home
 */
function redirectToHome() {
  console.log('🔄 Redirecionando para home...');
  window.location.href = '/index.html';
}

// ============================================
// 6. LOGOUT
// ============================================

/**
 * Faz logout do usuário
 */
function logout() {
  const user = getCurrentUser();
  console.log('👋 Desconectando usuário:', user?.name);
  
  clearUser();
  redirectToHome();
}

// ============================================
// 7. ATUALIZAÇÃO DE ATIVIDADE
// ============================================

/**
 * Atualiza o timestamp da última atividade
 * Chamado periodicamente para rastrear atividade do usuário
 */
function updateLastActivity() {
  const user = getCurrentUser();
  if (user) {
    user.lastActivity = new Date().toISOString();
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Inicia rastreamento de atividade do usuário
 * Atualiza a cada 5 minutos
 */
function startActivityTracking() {
  if (isAuthenticated()) {
    updateLastActivity();
    setInterval(updateLastActivity, 5 * 60 * 1000); // A cada 5 minutos
    console.log('📊 Rastreamento de atividade iniciado');
  }
}

// ============================================
// 8. VERIFICAÇÃO DE EXPIRAÇÃO DE SESSÃO
// ============================================

/**
 * Verifica se a sessão expirou (30 minutos de inatividade)
 */
function isSessionExpired() {
  const user = getCurrentUser();
  if (!user) return true;
  
  const lastActivity = new Date(user.lastActivity);
  const now = new Date();
  const diffMinutes = (now - lastActivity) / (1000 * 60);
  
  return diffMinutes > 30; // 30 minutos de inatividade
}

/**
 * Verifica expiração periodicamente e faz logout se expirou
 */
function startSessionExpirationCheck() {
  if (isAuthenticated()) {
    setInterval(() => {
      if (isSessionExpired()) {
        console.warn('⏰ Sessão expirada por inatividade');
        logout();
      }
    }, 60 * 1000); // Verificar a cada 1 minuto
    console.log('⏰ Verificação de expiração de sessão iniciada');
  }
}

// ============================================
// 9. INICIALIZAÇÃO
// ============================================

/**
 * Inicializa o sistema de permissões
 * Deve ser chamado no início de cada página
 */
function initPermissions() {
  console.log('🔐 Inicializando sistema de permissões...');
  
  // Atualizar atividade
  updateLastActivity();
  
  // Iniciar rastreamento
  startActivityTracking();
  startSessionExpirationCheck();
  
  // Exibir informações do usuário no console
  const user = getCurrentUser();
  if (user) {
    console.log('👤 Usuário:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('📧 Email:', user.email);
  }
}

// ============================================
// 10. UTILITÁRIOS
// ============================================

/**
 * Exibe informações de debug no console
 */
function debugPermissions() {
  console.group('🔍 Debug de Permissões');
  console.log('Autenticado:', isAuthenticated());
  console.log('Usuário:', getCurrentUser());
  console.log('Role:', getCurrentUser()?.role);
  console.log('É Admin:', isAdmin());
  console.log('Sessão expirada:', isSessionExpired());
  console.groupEnd();
}

/**
 * Exibe o usuário atual no console
 */
function printCurrentUser() {
  const user = getCurrentUser();
  if (user) {
    console.table(user);
  } else {
    console.log('❌ Nenhum usuário autenticado');
  }
}

// ============================================
// 11. INTEGRAÇÃO COM MENU
// ============================================

/**
 * Atualiza o menu baseado no estado de autenticação
 */
function updateMenuBasedOnAuth() {
  const isAuth = isAuthenticated();
  const isAdminUser = isAdmin();
  
  // Elementos que aparecem apenas para não autenticados
  const unauthElements = document.querySelectorAll('[data-auth="false"]');
  unauthElements.forEach(el => {
    el.style.display = isAuth ? 'none' : 'block';
  });
  
  // Elementos que aparecem apenas para autenticados
  const authElements = document.querySelectorAll('[data-auth="true"]');
  authElements.forEach(el => {
    el.style.display = isAuth ? 'block' : 'none';
  });
  
  // Elementos que aparecem apenas para admins
  const adminElements = document.querySelectorAll('[data-auth="admin"]');
  adminElements.forEach(el => {
    el.style.display = isAdminUser ? 'block' : 'none';
  });
  
  // Exibir nome do usuário
  if (isAuth) {
    const user = getCurrentUser();
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
      el.textContent = user.name;
    });
  }
}

// ============================================
// 12. EXPORTAR PARA USO GLOBAL
// ============================================

// Tornar funções disponíveis globalmente
window.Permissions = {
  // Autenticação
  isAuthenticated,
  isNotAuthenticated,
  
  // Roles
  hasRole,
  isAdmin,
  isRegularUser,
  hasAnyRole,
  hasAllRoles,
  
  // Proteção
  protectPage,
  protectPageAsync,
  
  // Usuário
  getCurrentUser,
  saveUser,
  clearUser,
  logout,
  
  // Atividade
  updateLastActivity,
  startActivityTracking,
  startSessionExpirationCheck,
  isSessionExpired,
  
  // Inicialização
  initPermissions,
  updateMenuBasedOnAuth,
  
  // Debug
  debugPermissions,
  printCurrentUser,
  
  // Redirecionamentos
  redirectToLogin,
  redirectToDashboard,
  redirectToAccessDenied,
  redirectToHome
};

// Inicializar automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  initPermissions();
  updateMenuBasedOnAuth();
});

console.log('✅ Sistema de permissões carregado com sucesso!');
