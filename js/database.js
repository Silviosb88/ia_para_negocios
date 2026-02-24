/**
 * Sistema de Banco de Dados com localStorage
 * Armazena usuários, uploads e moderação
 */

class Database {
    constructor() {
        this.initDB();
    }
    
    // Inicializar banco de dados
    initDB() {
        if (!localStorage.getItem('db_users')) {
            localStorage.setItem('db_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_uploads')) {
            localStorage.setItem('db_uploads', JSON.stringify([]));
        }
        if (!localStorage.getItem('db_activity')) {
            localStorage.setItem('db_activity', JSON.stringify([]));
        }
    }
    
    // ===== USUÁRIOS =====
    
    // Adicionar usuário
    addUser(userData) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        const user = {
            id: userData.id || Date.now(),
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            role: userData.role || 'user',
            createdAt: new Date().toISOString(),
            uploads: 0,
            approved: 0,
            banned: false
        };
        users.push(user);
        localStorage.setItem('db_users', JSON.stringify(users));
        return user;
    }
    
    // Obter usuário por ID
    getUser(id) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        return users.find(u => u.id === id);
    }
    
    // Obter todos os usuários
    getAllUsers() {
        return JSON.parse(localStorage.getItem('db_users') || '[]');
    }
    
    // Atualizar usuário
    updateUser(id, updates) {
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('db_users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }
    
    // Promover usuário a admin
    promoteToAdmin(id) {
        return this.updateUser(id, { role: 'admin' });
    }
    
    // Banir usuário
    banUser(id) {
        return this.updateUser(id, { banned: true });
    }
    
    // ===== UPLOADS =====
    
    // Adicionar upload
    addUpload(uploadData) {
        const uploads = JSON.parse(localStorage.getItem('db_uploads') || '[]');
        const upload = {
            id: uploadData.id || Date.now(),
            userId: uploadData.userId,
            title: uploadData.title,
            description: uploadData.description,
            type: uploadData.type, // imagem, video, avatar
            url: uploadData.url,
            status: 'pending', // pending, approved, rejected
            createdAt: new Date().toISOString(),
            approvedAt: null,
            approvedBy: null
        };
        uploads.push(upload);
        localStorage.setItem('db_uploads', JSON.stringify(uploads));
        
        // Incrementar contador de uploads do usuário
        const user = this.getUser(uploadData.userId);
        if (user) {
            this.updateUser(uploadData.userId, { uploads: user.uploads + 1 });
        }
        
        return upload;
    }
    
    // Obter uploads do usuário
    getUserUploads(userId) {
        const uploads = JSON.parse(localStorage.getItem('db_uploads') || '[]');
        return uploads.filter(u => u.userId === userId);
    }
    
    // Obter uploads pendentes
    getPendingUploads() {
        const uploads = JSON.parse(localStorage.getItem('db_uploads') || '[]');
        return uploads.filter(u => u.status === 'pending');
    }
    
    // Obter todos os uploads
    getAllUploads() {
        return JSON.parse(localStorage.getItem('db_uploads') || '[]');
    }
    
    // Aprovar upload
    approveUpload(uploadId, adminId) {
        const uploads = JSON.parse(localStorage.getItem('db_uploads') || '[]');
        const index = uploads.findIndex(u => u.id === uploadId);
        if (index !== -1) {
            uploads[index].status = 'approved';
            uploads[index].approvedAt = new Date().toISOString();
            uploads[index].approvedBy = adminId;
            localStorage.setItem('db_uploads', JSON.stringify(uploads));
            
            // Incrementar contador de aprovados
            const user = this.getUser(uploads[index].userId);
            if (user) {
                this.updateUser(uploads[index].userId, { approved: user.approved + 1 });
            }
            
            return uploads[index];
        }
        return null;
    }
    
    // Rejeitar upload
    rejectUpload(uploadId) {
        const uploads = JSON.parse(localStorage.getItem('db_uploads') || '[]');
        const index = uploads.findIndex(u => u.id === uploadId);
        if (index !== -1) {
            uploads[index].status = 'rejected';
            localStorage.setItem('db_uploads', JSON.stringify(uploads));
            return uploads[index];
        }
        return null;
    }
    
    // ===== ATIVIDADE =====
    
    // Registrar atividade
    logActivity(userId, action, details) {
        const activity = JSON.parse(localStorage.getItem('db_activity') || '[]');
        activity.push({
            id: Date.now(),
            userId: userId,
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('db_activity', JSON.stringify(activity));
    }
    
    // Obter atividade do usuário
    getUserActivity(userId) {
        const activity = JSON.parse(localStorage.getItem('db_activity') || '[]');
        return activity.filter(a => a.userId === userId);
    }
    
    // ===== ESTATÍSTICAS =====
    
    // Obter estatísticas
    getStats() {
        const users = this.getAllUsers();
        const uploads = this.getAllUploads();
        
        return {
            totalUsers: users.length,
            totalAdmins: users.filter(u => u.role === 'admin').length,
            totalBanned: users.filter(u => u.banned).length,
            totalUploads: uploads.length,
            pendingUploads: uploads.filter(u => u.status === 'pending').length,
            approvedUploads: uploads.filter(u => u.status === 'approved').length,
            rejectedUploads: uploads.filter(u => u.status === 'rejected').length
        };
    }
    
    // ===== LIMPEZA =====
    
    // Limpar banco de dados (apenas para testes)
    clearDatabase() {
        localStorage.removeItem('db_users');
        localStorage.removeItem('db_uploads');
        localStorage.removeItem('db_activity');
        this.initDB();
    }
}

// Criar instância global
const DB = new Database();

console.log('✅ Sistema de banco de dados carregado');
