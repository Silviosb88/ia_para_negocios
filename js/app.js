// Dados e estado da aplicação
let trabalhos = []; 
let trabalhosFiltrados = []; 
let currentModalIndex = 0;

// Elementos DOM
const galleryGrid = document.getElementById('galleryGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const workCounter = document.getElementById('workCounter');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

// Carregar dados
async function loadTrabalhos() {
    try {
        const response = await fetch('data/trabalhos.json');
        trabalhos = await response.json();
        trabalhosFiltrados = trabalhos.trabalhos;
        renderGallery();
        updateCounter();
    } catch (error) {
        console.error('Erro ao carregar trabalhos:', error);
        loading.innerHTML = '<i class="fas fa-exclamation-circle"></i><p>Erro ao carregar trabalhos</p>';
    }
}

// Renderizar galeria
function renderGallery() {
    loading.style.display = 'none';
    
    if (trabalhosFiltrados.length === 0) {
        galleryGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    galleryGrid.style.display = 'grid';
    noResults.style.display = 'none';
    galleryGrid.innerHTML = '';
    
    trabalhosFiltrados.forEach((trabalho, index) => {
        const card = createCard(trabalho, index);
        galleryGrid.appendChild(card);
    });
}

// Criar card
function createCard(trabalho, index) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.onclick = () => openModal(index);
    
    const imageUrl = trabalho.url || 'https://via.placeholder.com/400x300/667eea/ffffff?text=' + encodeURIComponent(trabalho.titulo);
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${trabalho.titulo}" class="card-image" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=Imagem+Indisponível'">
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-title">${trabalho.titulo}</h3>
                <span class="type-badge ${trabalho.tipo}">${trabalho.tipo}</span>
            </div>
            <p class="card-student">
                <i class="fas fa-user"></i>
                ${trabalho.estudante}
            </p>
            <p class="card-description">${trabalho.descricao}</p>
            <div class="card-tools">
                ${trabalho.ferramentas.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
            </div>
            <p class="card-date">
                <i class="fas fa-calendar"></i>
                ${formatDate(trabalho.data)}
            </p>
        </div>
    `;
    
    return card;
}

// Abrir modal
function openModal(index) {
    currentModalIndex = index;
    const trabalho = trabalhosFiltrados[index];
    
    document.getElementById('modalTitle').textContent = trabalho.titulo;
    document.getElementById('modalStudent').textContent = trabalho.estudante;
    document.getElementById('modalDescription').textContent = trabalho.descricao;
    document.getElementById('modalDate').textContent = formatDate(trabalho.data);
    
    // Ferramentas
    const toolsContainer = document.getElementById('modalTools');
    toolsContainer.innerHTML = trabalho.ferramentas
        .map(tool => `<span class="tool-tag">${tool}</span>`)
        .join('');
    
    // Media
    const mediaContainer = document.getElementById('modalMedia');
    if (trabalho.tipo === 'video' && trabalho.videoUrl) {
        mediaContainer.innerHTML = `
            <video controls>
                <source src="${trabalho.videoUrl}" type="video/mp4">
                Seu navegador não suporta vídeo.
            </video>
        `;
    } else {
        const imageUrl = trabalho.url || 'https://via.placeholder.com/800x600/667eea/ffffff?text=' + encodeURIComponent(trabalho.titulo);
        mediaContainer.innerHTML = `<img src="${imageUrl}" alt="${trabalho.titulo}" onerror="this.src='https://via.placeholder.com/800x600/667eea/ffffff?text=Imagem+Indisponível'">`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navegação modal
function navigateModal(direction) {
    currentModalIndex += direction;
    
    if (currentModalIndex < 0) {
        currentModalIndex = trabalhosFiltrados.length - 1;
    } else if (currentModalIndex >= trabalhosFiltrados.length) {
        currentModalIndex = 0;
    }
    
    openModal(currentModalIndex);
}

// Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Atualizar botão ativo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrar
        const filter = btn.dataset.filter;
        if (filter === 'todos') {
            trabalhosFiltrados = trabalhos.trabalhos;
        } else {
            trabalhosFiltrados = trabalhos.trabalhos.filter(t => t.tipo === filter);
        }
        
        renderGallery();
        updateCounter();
    });
});

// Busca
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    let baseTrabalhos = activeFilter === 'todos' 
        ? trabalhos.trabalhos 
        : trabalhos.trabalhos.filter(t => t.tipo === activeFilter);
    
    trabalhosFiltrados = baseTrabalhos.filter(trabalho => 
        trabalho.estudante.toLowerCase().includes(searchTerm) ||
        trabalho.titulo.toLowerCase().includes(searchTerm)
    );
    
    renderGallery();
    updateCounter();
});

// Atualizar contador
function updateCounter() {
    workCounter.textContent = trabalhosFiltrados.length;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Event listeners
modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navigateModal(-1));
modalNext.addEventListener('click', () => navigateModal(1));

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Fechar modal clicando fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Navegação com setas
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    }
});

// Inicializar
loadTrabalhos();