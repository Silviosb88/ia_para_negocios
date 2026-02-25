/**
 * Configuração da Aplicação
 * URLs, endpoints e constantes globais
 */

const CONFIG = {
  // Backend API
  API_BASE_URL: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
  API_TRPC_URL: process.env.VITE_BACKEND_URL ? `${process.env.VITE_BACKEND_URL}/api/trpc` : 'http://localhost:3000/api/trpc',
  
  // OAuth
  GITHUB_CLIENT_ID: 'Ov23li37h0OtTvWefpFQ',
  GITHUB_REDIRECT_URI: 'https://clubedofoco.ia.br/callback.html',
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  
  // Limites
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILE_NAME_LENGTH: 255,
  
  // Tipos de arquivo permitidos
  ALLOWED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
    avatar: ['image/jpeg', 'image/png', 'video/mp4']
  },
  
  // Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },
  
  // Upload Status
  UPLOAD_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },
  
  // Tipos de trabalho
  WORK_TYPES: {
    IMAGE: 'imagem',
    VIDEO: 'video',
    AVATAR: 'avatar'
  }
};

// Exportar para uso global
window.CONFIG = CONFIG;
