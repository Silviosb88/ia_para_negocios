/**
 * Clube do Foco - Upload System
 * JavaScript functionality for upload page
 */

// ============================================
// State Management
// ============================================

const state = {
    selectedFile: null,
    selectedTools: [],
    isSubmitting: false
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    fileDropzone: document.getElementById('fileDropzone'),
    fileInput: document.getElementById('file'),
    filePreview: document.getElementById('filePreview'),
    fileError: document.getElementById('fileError'),
    previewImage: document.getElementById('previewImage'),
    previewVideo: document.getElementById('previewVideo'),
    previewAudio: document.getElementById('previewAudio'),
    previewName: document.getElementById('previewName'),
    previewSize: document.getElementById('previewSize'),
    removeFileBtn: document.getElementById('removeFile'),
    
    titleInput: document.getElementById('title'),
    titleCount: document.getElementById('titleCount'),
    descriptionInput: document.getElementById('description'),
    descriptionCount: document.getElementById('descriptionCount'),
    typeSelect: document.getElementById('type'),
    sourceInput: document.getElementById('source'),
    authorInput: document.getElementById('author'),
    termsCheckbox: document.getElementById('terms'),
    
    toolButtons: document.querySelectorAll('.tool-btn'),
    selectedToolsContainer: document.getElementById('selectedTools'),
    toolsInput: document.getElementById('tools'),
    
    uploadForm: document.getElementById('uploadForm'),
    submitBtn: document.querySelector('.btn-submit'),
    btnText: document.querySelector('.btn-text'),
    btnLoader: document.querySelector('.btn-loader'),
    successMessage: document.getElementById('successMessage'),
    newUploadBtn: document.getElementById('newUploadBtn')
};

// ============================================
// File Upload Handlers
// ============================================

// Setup drag and drop
elements.fileDropzone.addEventListener('dragover', handleDragOver);
elements.fileDropzone.addEventListener('dragleave', handleDragLeave);
elements.fileDropzone.addEventListener('drop', handleDrop);
elements.fileDropzone.addEventListener('click', () => elements.fileInput.click());

elements.fileInput.addEventListener('change', handleFileSelect);
elements.removeFileBtn.addEventListener('click', removeFile);

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.fileDropzone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.fileDropzone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.fileDropzone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        elements.fileInput.files = files;
        handleFileSelect({ target: { files } });
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
        showFileError(validation.error);
        return;
    }
    
    state.selectedFile = file;
    displayFilePreview(file);
    hideFileError();
}

function validateFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'];
    
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Arquivo muito grande. Máximo 100MB (seu arquivo: ${formatFileSize(file.size)})`
        };
    }
    
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Tipo de arquivo não permitido. Aceitos: JPG, PNG, MP4, WebM, MP3, WAV`
        };
    }
    
    return { valid: true };
}

function displayFilePreview(file) {
    const fileType = file.type.split('/')[0];
    const fileName = file.name;
    const fileSize = formatFileSize(file.size);
    
    // Hide all preview elements
    elements.previewImage.style.display = 'none';
    elements.previewVideo.style.display = 'none';
    elements.previewAudio.style.display = 'none';
    
    // Show appropriate preview
    if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.previewImage.src = e.target.result;
            elements.previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else if (fileType === 'video') {
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.previewVideo.src = e.target.result;
            elements.previewVideo.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else if (fileType === 'audio') {
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.previewAudio.src = e.target.result;
            elements.previewAudio.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    elements.previewName.textContent = fileName;
    elements.previewSize.textContent = fileSize;
    elements.filePreview.style.display = 'flex';
}

function removeFile() {
    state.selectedFile = null;
    elements.fileInput.value = '';
    elements.filePreview.style.display = 'none';
    hideFileError();
}

function showFileError(error) {
    elements.fileError.textContent = error;
    elements.fileError.style.display = 'block';
}

function hideFileError() {
    elements.fileError.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// Character Counters
// ============================================

elements.titleInput.addEventListener('input', (e) => {
    elements.titleCount.textContent = e.target.value.length;
});

elements.descriptionInput.addEventListener('input', (e) => {
    elements.descriptionCount.textContent = e.target.value.length;
});

// ============================================
// Tools Selection
// ============================================

elements.toolButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tool = btn.dataset.tool;
        
        if (state.selectedTools.includes(tool)) {
            state.selectedTools = state.selectedTools.filter(t => t !== tool);
            btn.classList.remove('active');
        } else {
            state.selectedTools.push(tool);
            btn.classList.add('active');
        }
        
        updateSelectedTools();
    });
});

function updateSelectedTools() {
    elements.selectedToolsContainer.innerHTML = '';
    
    state.selectedTools.forEach(tool => {
        const tag = document.createElement('div');
        tag.className = 'tool-tag';
        tag.innerHTML = `
            ${tool}
            <button type="button" class="tool-tag-remove" data-tool="${tool}">×</button>
        `;
        
        tag.querySelector('.tool-tag-remove').addEventListener('click', (e) => {
            e.preventDefault();
            state.selectedTools = state.selectedTools.filter(t => t !== tool);
            document.querySelector(`[data-tool="${tool}"]`).classList.remove('active');
            updateSelectedTools();
        });
        
        elements.selectedToolsContainer.appendChild(tag);
    });
    
    elements.toolsInput.value = JSON.stringify(state.selectedTools);
}

// ============================================
// Form Submission
// ============================================

elements.uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
        alert(validation.error);
        return;
    }
    
    // Submit form
    await submitForm();
});

function validateForm() {
    if (!state.selectedFile) {
        return { valid: false, error: 'Por favor, selecione um arquivo' };
    }
    
    if (!elements.titleInput.value.trim()) {
        return { valid: false, error: 'Por favor, preencha o título' };
    }
    
    if (!elements.descriptionInput.value.trim()) {
        return { valid: false, error: 'Por favor, preencha a descrição' };
    }
    
    if (!elements.typeSelect.value) {
        return { valid: false, error: 'Por favor, selecione o tipo de conteúdo' };
    }
    
    if (state.selectedTools.length === 0) {
        return { valid: false, error: 'Por favor, selecione pelo menos uma ferramenta de IA' };
    }
    
    if (!elements.authorInput.value.trim()) {
        return { valid: false, error: 'Por favor, preencha seu nome' };
    }
    
    if (!elements.termsCheckbox.checked) {
        return { valid: false, error: 'Por favor, aceite os termos de compartilhamento' };
    }
    
    return { valid: true };
}

async function submitForm() {
    if (state.isSubmitting) return;
    
    state.isSubmitting = true;
    elements.submitBtn.disabled = true;
    elements.btnText.style.display = 'none';
    elements.btnLoader.style.display = 'inline';
    
    try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', state.selectedFile);
        formData.append('title', elements.titleInput.value);
        formData.append('description', elements.descriptionInput.value);
        formData.append('type', elements.typeSelect.value);
        formData.append('source', elements.sourceInput.value);
        formData.append('author', elements.authorInput.value);
        formData.append('tools', JSON.stringify(state.selectedTools));
        formData.append('timestamp', new Date().toISOString().split('T')[0]);
        
        // Log for debugging (remove in production)
        console.log('Enviando upload:', {
            file: state.selectedFile.name,
            title: elements.titleInput.value,
            type: elements.typeSelect.value,
            tools: state.selectedTools,
            author: elements.authorInput.value
        });
        
        // Simulate submission (in production, send to API)
        await simulateUpload(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar o arquivo. Por favor, tente novamente.');
    } finally {
        state.isSubmitting = false;
        elements.submitBtn.disabled = false;
        elements.btnText.style.display = 'inline';
        elements.btnLoader.style.display = 'none';
    }
}

async function simulateUpload(formData) {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // In production, this would be:
            // fetch('/api/upload', { method: 'POST', body: formData })
            
            // For now, just simulate success
            console.log('Upload simulado com sucesso');
            resolve();
        }, 2000);
    });
}

function showSuccessMessage() {
    elements.uploadForm.style.display = 'none';
    elements.successMessage.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    elements.uploadForm.reset();
    state.selectedFile = null;
    state.selectedTools = [];
    elements.filePreview.style.display = 'none';
    elements.titleCount.textContent = '0';
    elements.descriptionCount.textContent = '0';
    elements.selectedToolsContainer.innerHTML = '';
    elements.toolsInput.value = '';
    elements.toolButtons.forEach(btn => btn.classList.remove('active'));
}

elements.newUploadBtn.addEventListener('click', () => {
    elements.successMessage.style.display = 'none';
    elements.uploadForm.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Upload page initialized');
    
    // Load saved author name if exists
    const savedAuthor = localStorage.getItem('clubedofoco_author');
    if (savedAuthor) {
        elements.authorInput.value = savedAuthor;
    }
    
    // Save author name on change
    elements.authorInput.addEventListener('change', (e) => {
        localStorage.setItem('clubedofoco_author', e.target.value);
    });
});
