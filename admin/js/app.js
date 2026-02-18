/**
 * Clube do Foco - Admin Panel
 * Moderation dashboard functionality
 */

// ============================================
// State Management
// ============================================

const state = {
    isAuthenticated: false,
    currentUser: null,
    uploads: [],
    filteredUploads: [],
    selectedUpload: null,
    filters: {
        status: '',
        type: '',
        search: ''
    }
};

// ============================================
// Mock Data (Replace with API calls)
// ============================================

const mockUploads = [
    {
        id: 'UPL001',
        title: 'Avatar IA com Synthesia',
        author: 'João Silva',
        type: 'avatar',
        status: 'pending',
        date: '2026-02-14',
        description: 'Avatar digital criado com Synthesia para apresentação corporativa. Sincronização labial realista em português.',
        tools: ['Synthesia', 'Adobe Firefly'],
        source: 'Tutorial YouTube',
        file: 'avatar-synthesia.mp4',
        preview: 'https://via.placeholder.com/400x300?text=Avatar+Synthesia'
    },
    {
        id: 'UPL002',
        title: 'Imagem Futurista com DALL-E',
        author: 'Maria Santos',
        type: 'imagem',
        status: 'pending',
        date: '2026-02-13',
        description: 'Paisagem urbana futurista gerada com DALL-E 3. Tema cyberpunk com neon e hologramas.',
        tools: ['DALL-E 3'],
        source: null,
        file: 'futuristic-city.jpg',
        preview: 'https://via.placeholder.com/400x300?text=Futuristic+City'
    },
    {
        id: 'UPL003',
        title: 'Vídeo Explicativo com Runway ML',
        author: 'Pedro Costa',
        type: 'video',
        status: 'approved',
        date: '2026-02-12',
        description: 'Vídeo explicativo de conceitos de IA gerado com Runway ML. Motion graphics profissional.',
        tools: ['Runway ML', 'Adobe Premiere'],
        source: null,
        file: 'ai-concepts-video.mp4',
        preview: 'https://via.placeholder.com/400x300?text=AI+Concepts'
    }
];

// ============================================
// DOM Elements
// ============================================

const elements = {
    loginScreen: document.getElementById('loginScreen'),
    dashboard: document.getElementById('dashboard'),
    userInfo: document.getElementById('userInfo'),
    userName: document.getElementById('userName'),
    loginBtn: document.getElementById('loginBtn'),
    loginBtnLarge: document.getElementById('loginBtnLarge'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    pendingCount: document.getElementById('pendingCount'),
    approvedCount: document.getElementById('approvedCount'),
    rejectedCount: document.getElementById('rejectedCount'),
    totalCount: document.getElementById('totalCount'),
    
    statusFilter: document.getElementById('statusFilter'),
    typeFilter: document.getElementById('typeFilter'),
    searchInput: document.getElementById('searchInput'),
    refreshBtn: document.getElementById('refreshBtn'),
    queueList: document.getElementById('queueList'),
    
    modal: document.getElementById('detailsModal'),
    modalClose: document.getElementById('modalClose'),
    modalTitle: document.getElementById('modalTitle'),
    modalAuthor: document.getElementById('modalAuthor'),
    modalType: document.getElementById('modalType'),
    modalDate: document.getElementById('modalDate'),
    modalDescription: document.getElementById('modalDescription'),
    modalTools: document.getElementById('modalTools'),
    modalSource: document.getElementById('modalSource'),
    sourceSection: document.getElementById('sourceSection'),
    modalImage: document.getElementById('modalImage'),
    modalVideo: document.getElementById('modalVideo'),
    modalAudio: document.getElementById('modalAudio'),
    approveBtn: document.getElementById('approveBtn'),
    rejectBtn: document.getElementById('rejectBtn')
};

// ============================================
// Authentication
// ============================================

elements.loginBtn.addEventListener('click', handleLogin);
elements.loginBtnLarge.addEventListener('click', handleLogin);
elements.logoutBtn.addEventListener('click', handleLogout);

function handleLogin() {
    // In production, this would redirect to GitHub OAuth
    // For now, simulate login
    state.isAuthenticated = true;
    state.currentUser = {
        name: 'Moderador',
        login: 'moderador'
    };
    updateUI();
    loadUploads();
}

function handleLogout() {
    state.isAuthenticated = false;
    state.currentUser = null;
    updateUI();
}

function updateUI() {
    if (state.isAuthenticated) {
        elements.loginScreen.style.display = 'none';
        elements.dashboard.style.display = 'block';
        elements.userInfo.style.display = 'flex';
        elements.loginBtn.style.display = 'none';
        elements.userName.textContent = state.currentUser.name;
    } else {
        elements.loginScreen.style.display = 'flex';
        elements.dashboard.style.display = 'none';
        elements.userInfo.style.display = 'none';
        elements.loginBtn.style.display = 'block';
    }
}

// ============================================
// Load Uploads
// ============================================

elements.refreshBtn.addEventListener('click', loadUploads);

function loadUploads() {
    // In production, fetch from API
    state.uploads = mockUploads;
    updateStats();
    applyFilters();
    renderQueue();
}

function updateStats() {
    const pending = state.uploads.filter(u => u.status === 'pending').length;
    const approved = state.uploads.filter(u => u.status === 'approved').length;
    const rejected = state.uploads.filter(u => u.status === 'rejected').length;
    
    elements.pendingCount.textContent = pending;
    elements.approvedCount.textContent = approved;
    elements.rejectedCount.textContent = rejected;
    elements.totalCount.textContent = state.uploads.length;
}

// ============================================
// Filters
// ============================================

elements.statusFilter.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    applyFilters();
    renderQueue();
});

elements.typeFilter.addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    applyFilters();
    renderQueue();
});

elements.searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value.toLowerCase();
    applyFilters();
    renderQueue();
});

function applyFilters() {
    state.filteredUploads = state.uploads.filter(upload => {
        const statusMatch = !state.filters.status || upload.status === state.filters.status;
        const typeMatch = !state.filters.type || upload.type === state.filters.type;
        const searchMatch = !state.filters.search || 
            upload.title.toLowerCase().includes(state.filters.search) ||
            upload.author.toLowerCase().includes(state.filters.search);
        
        return statusMatch && typeMatch && searchMatch;
    });
}

// ============================================
// Render Queue
// ============================================

function renderQueue() {
    if (state.filteredUploads.length === 0) {
        elements.queueList.innerHTML = '<div class="empty-state"><p>Nenhum upload para moderar</p></div>';
        return;
    }
    
    elements.queueList.innerHTML = state.filteredUploads.map(upload => `
        <div class="queue-item" onclick="openDetails('${upload.id}')">
            <div class="queue-item-thumbnail">
                <img src="${upload.preview}" alt="${upload.title}">
            </div>
            <div class="queue-item-content">
                <div class="queue-item-title">${upload.title}</div>
                <div class="queue-item-meta">
                    <span>👤 ${upload.author}</span>
                    <span>📅 ${formatDate(upload.date)}</span>
                    <span class="queue-item-badge badge-${upload.status}">${getStatusLabel(upload.status)}</span>
                </div>
                <div class="queue-item-meta">
                    ${upload.tools.map(tool => `<span>🔧 ${tool}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// ============================================
// Modal
// ============================================

elements.modalClose.addEventListener('click', closeModal);
elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

elements.approveBtn.addEventListener('click', approveUpload);
elements.rejectBtn.addEventListener('click', rejectUpload);

function openDetails(uploadId) {
    const upload = state.uploads.find(u => u.id === uploadId);
    if (!upload) return;
    
    state.selectedUpload = upload;
    
    // Update modal content
    elements.modalTitle.textContent = upload.title;
    elements.modalAuthor.textContent = upload.author;
    elements.modalType.textContent = getTypeLabel(upload.type);
    elements.modalDate.textContent = formatDate(upload.date);
    elements.modalDescription.textContent = upload.description;
    
    // Update tools
    elements.modalTools.innerHTML = upload.tools
        .map(tool => `<span class="tool-tag">${tool}</span>`)
        .join('');
    
    // Update source
    if (upload.source) {
        elements.sourceSection.style.display = 'block';
        elements.modalSource.textContent = upload.source;
    } else {
        elements.sourceSection.style.display = 'none';
    }
    
    // Update preview
    elements.modalImage.style.display = 'none';
    elements.modalVideo.style.display = 'none';
    elements.modalAudio.style.display = 'none';
    
    if (upload.type === 'imagem') {
        elements.modalImage.src = upload.preview;
        elements.modalImage.style.display = 'block';
    } else if (upload.type === 'video') {
        elements.modalVideo.src = upload.preview;
        elements.modalVideo.style.display = 'block';
    } else if (upload.type === 'audio') {
        elements.modalAudio.src = upload.preview;
        elements.modalAudio.style.display = 'block';
    }
    
    // Show modal
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
    state.selectedUpload = null;
}

function getTypeLabel(type) {
    const labels = {
        imagem: '🖼️ Imagem',
        video: '🎥 Vídeo',
        avatar: '👤 Avatar',
        audio: '🎵 Áudio',
        outro: '📦 Outro'
    };
    return labels[type] || type;
}

// ============================================
// Moderation Actions
// ============================================

function approveUpload() {
    if (!state.selectedUpload) return;
    
    // Update status
    const upload = state.uploads.find(u => u.id === state.selectedUpload.id);
    if (upload) {
        upload.status = 'approved';
        
        // In production, send to API
        console.log('Upload aprovado:', upload.id);
        
        // Update UI
        updateStats();
        applyFilters();
        renderQueue();
        closeModal();
        
        // Show notification
        showNotification('✅ Upload aprovado com sucesso!');
    }
}

function rejectUpload() {
    if (!state.selectedUpload) return;
    
    const reason = prompt('Motivo da rejeição (opcional):');
    
    // Update status
    const upload = state.uploads.find(u => u.id === state.selectedUpload.id);
    if (upload) {
        upload.status = 'rejected';
        
        // In production, send to API with reason
        console.log('Upload rejeitado:', upload.id, 'Motivo:', reason);
        
        // Update UI
        updateStats();
        applyFilters();
        renderQueue();
        closeModal();
        
        // Show notification
        showNotification('❌ Upload rejeitado');
    }
}

function showNotification(message) {
    // Simple notification (in production, use a toast library)
    alert(message);
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel initialized');
    updateUI();
});
