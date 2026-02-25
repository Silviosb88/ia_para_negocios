/**
 * Clube do Foco - tRPC Client
 * Cliente para comunicação com backend Express + tRPC
 */

// ============================================
// Configuração
// ============================================

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_BASE = `${BACKEND_URL}/api/trpc`;

// ============================================
// Cliente tRPC Simplificado
// ============================================

const trpc = {
  /**
   * Fazer chamada para o backend
   */
  async call(path, input = null, method = 'POST') {
    try {
      const url = `${API_BASE}/${path}`;
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
      };

      if (input && method === 'POST') {
        options.body = JSON.stringify({ input });
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result?.data;
    } catch (error) {
      console.error(`[tRPC] Erro em ${path}:`, error);
      throw error;
    }
  },

  // ============================================
  // Auth
  // ============================================
  auth: {
    /**
     * Obter usuário atual
     */
    async me() {
      return trpc.call('auth.me', null, 'GET');
    },

    /**
     * Fazer logout
     */
    async logout() {
      return trpc.call('auth.logout', {});
    }
  },

  // ============================================
  // Uploads
  // ============================================
  uploads: {
    /**
     * Criar novo upload
     */
    async create(input) {
      return trpc.call('uploads.create', input);
    },

    /**
     * Obter upload por ID
     */
    async getById(uploadId) {
      return trpc.call(`uploads.getById?input=${JSON.stringify({ uploadId })}`, null, 'GET');
    },

    /**
     * Listar uploads do usuário
     */
    async getUserUploads() {
      return trpc.call('uploads.getUserUploads', null, 'GET');
    },

    /**
     * Listar uploads pendentes (admin)
     */
    async getPendingUploads() {
      return trpc.call('uploads.getPendingUploads', null, 'GET');
    },

    /**
     * Atualizar status de upload (admin)
     */
    async updateStatus(uploadId, status, moderationNotes = '') {
      return trpc.call('uploads.updateStatus', {
        uploadId,
        status,
        moderationNotes
      });
    }
  },

  // ============================================
  // Galeria
  // ============================================
  gallery: {
    /**
     * Obter galeria pública
     */
    async getPublic() {
      return trpc.call('gallery.getPublic', null, 'GET');
    },

    /**
     * Filtrar galeria por tipo
     */
    async getByType(type) {
      return trpc.call(`gallery.getByType?input=${JSON.stringify({ type })}`, null, 'GET');
    },

    /**
     * Incrementar visualizações
     */
    async incrementViews(galleryId) {
      return trpc.call('gallery.incrementViews', { galleryId });
    }
  },

  // ============================================
  // Moderação
  // ============================================
  moderation: {
    /**
     * Obter fila de moderação
     */
    async getQueue() {
      return trpc.call('moderation.getQueue', null, 'GET');
    },

    /**
     * Aprovar upload
     */
    async approve(uploadId, moderatorNotes = '') {
      return trpc.call('uploads.updateStatus', {
        uploadId,
        status: 'approved',
        moderationNotes
      });
    },

    /**
     * Rejeitar upload
     */
    async reject(uploadId, moderatorNotes = '') {
      return trpc.call('uploads.updateStatus', {
        uploadId,
        status: 'rejected',
        moderationNotes
      });
    }
  }
};

// ============================================
// Exportar para uso global
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = trpc;
}
