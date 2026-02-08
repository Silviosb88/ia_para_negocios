/*
╔══════════════════════════════════════════════════════════════╗
║  CLUBE DO FOCO - SISTEMA DE UPLOAD                           ║
║  MBA em IA Aplicada aos Negócios                             ║
╠══════════════════════════════════════════════════════════════╣
║  ARQUIVO: upload.js                                          ║
║  PROPÓSITO: Gerenciar upload de trabalhos via GitHub API    ║
║  TECNOLOGIAS: JavaScript ES6+, GitHub REST API, OAuth 2.0   ║
║  CRIADO COM: GitHub Copilot (IA)                             ║
╠══════════════════════════════════════════════════════════════╣
║  CONCEITOS APRENDIDOS:                                       ║
║  ✓ Autenticação OAuth                                        ║
║  ✓ APIs RESTful                                              ║
║  ✓ Manipulação de arquivos                                   ║
║  ✓ Programação assíncrona (async/await)                      ║
║  ✓ Validação de dados                                        ║
║  ✓ Tratamento de erros                                       ║
╠══════════════════════════════════════════════════════════════╣
║  COMO REPLICAR ESTE SISTEMA:                                 ║
║  1. Configure OAuth App no GitHub                            ║
║  2. Obtenha credenciais (Client ID)                          ║
║  3. Configure permissões (repo, user)                        ║
║  4. Implemente autenticação                                  ║
║  5. Use GitHub API para criar commits                        ║
╠══════════════════════════════════════════════════════════════╣
║  RECURSOS ÚTEIS:                                             ║
║  📚 GitHub API: https://docs.github.com/rest                 ║
║  🔐 OAuth: https://docs.github.com/developers/apps/oauth     ║
║  💻 JavaScript: https://developer.mozilla.org/JavaScript     ║
╚══════════════════════════════════════════════════════════════╝
*/

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const CONFIG = {
    // GitHub OAuth App Configuration
    // IMPORTANTE: Você precisa criar um OAuth App em:
    // https://github.com/settings/developers
    CLIENT_ID: 'SEU_CLIENT_ID_AQUI', // Substitua pelo seu Client ID
    
    // Repositório onde os arquivos serão salvos
    REPO_OWNER: 'Silviosb88',
    REPO_NAME: 'ia_para_negocios',
    REPO_BRANCH: 'main',
    
    // Pastas no repositório
    IMAGES_PATH: 'data/images/',
    JSON_PATH: 'data/trabalhos.json',
    
    // Limites de upload
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
    
    // URLs
    REDIRECT_URI: window.location.origin + '/upload.html'
};

// ============================================================
// ESTADO DA APLICAÇÃO
// ============================================================

/**
 * 🎓 CONCEITO: State Management
 * 
 * Mantemos o "estado" da aplicação em um objeto central.
 * Isso facilita rastrear o que está acontecendo e debug.
 * 
 * Em aplicações maiores, usaríamos Redux, Vuex ou Context API.
 */
const AppState = {
    user: null,
    accessToken: null,
    selectedFile: null,
    isUploading: false,
    uploadProgress: 0
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================

/**
 * 🎯 FUNÇÃO: init()
 * 
 * Inicializa a aplicação quando a página carrega.
 * Verifica se usuário já está autenticado.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema de Upload inicializado');
    
    // Verifica se há um código OAuth na URL
    handleOAuthCallback();
    
    // Configura event listeners
    setupEventListeners();
    
    // Verifica se há token salvo
    checkExistingAuth();
});

// ============================================================
// AUTENTICAÇÃO COM GITHUB
// ============================================================

/**
 * 🎯 FUNÇÃO: authenticateWithGitHub()
 * 
 * 📖 O QUE FAZ:
 * Inicia o processo de autenticação OAuth com GitHub.
 * 
 * 🔍 COMO FUNCIONA (Fluxo OAuth 2.0):
 * 
 * 1. AUTHORIZATION REQUEST:
 *    User → GitHub: "Quero autorizar este app"
 *    
 * 2. USER AUTHORIZATION:
 *    GitHub → User: "Permite que 'Clube do Foco' acesse seu perfil?"
 *    User → GitHub: "Sim, autorizo"
 *    
 * 3. AUTHORIZATION CODE:
 *    GitHub → App: "Aqui está um código temporário: ABC123"
 *    
 * 4. ACCESS TOKEN:
 *    App → GitHub: "Troco este código por um token de acesso"
 *    GitHub → App: "Ok, aqui está seu token: XYZ789"
 *    
 * 5. API REQUESTS:
 *    App → GitHub API: "Quero criar um arquivo (token: XYZ789)"
 *    
 * 💡 POR QUE OAuth?
 * - Usuário NUNCA dá senha para nós
 * - Pode revogar acesso a qualquer momento
 * - Permissões específicas (só o que precisamos)
 * - Padrão da indústria (Google, Facebook, etc usam)
 * 
 * 🎓 APLICAÇÃO EM IA:
 * OAuth permite que agentes de IA acessem recursos de forma
 * segura. Ex: Copilot acessa seus repos, ChatGPT plugins, etc.
 * 
 * 📚 APRENDA MAIS:
 * https://docs.github.com/en/developers/apps/oauth-apps
 */
function authenticateWithGitHub() {
    console.log('🔐 Iniciando autenticação OAuth...');
    
    // Gera um "state" aleatório para prevenir CSRF
    const state = generateRandomState();
    localStorage.setItem('oauth_state', state);
    
    // Constrói URL de autorização
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', CONFIG.CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', CONFIG.REDIRECT_URI);
    authUrl.searchParams.append('scope', 'repo user'); // Permissões necessárias
    authUrl.searchParams.append('state', state);
    
    // Redireciona para GitHub
    window.location.href = authUrl.toString();
}

/**
 * 🎯 FUNÇÃO: handleOAuthCallback()
 * 
 * Processa o retorno do GitHub após autorização.
 */
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (!code) return; // Não há callback OAuth
    
    // Verifica state (segurança contra CSRF)
    const savedState = localStorage.getItem('oauth_state');
    if (state !== savedState) {
        showError('Erro de segurança. Tente novamente.');
        return;
    }
    
    // Troca código por token
    exchangeCodeForToken(code);
}

/**
 * 🎯 FUNÇÃO: exchangeCodeForToken()
 * 
 * ⚠️ IMPORTANTE: Por segurança, esta troca deve ser feita no BACKEND!
 * 
 * 💡 SOLUÇÃO TEMPORÁRIA:
 * Para fins educacionais, usaremos um serviço proxy ou
 * você pode configurar um backend simples (Vercel, Netlify Functions).
 * 
 * 🔧 PRÓXIMOS PASSOS (Produção):
 * 1. Criar função serverless
 * 2. Guardar CLIENT_SECRET lá (nunca no frontend!)
 * 3. Frontend chama sua função
 * 4. Função chama GitHub e retorna token
 */
async function exchangeCodeForToken(code) {
    try {
        showMessage('Autenticando...', 'info');
        
        // ATENÇÃO: Isto é simplificado para fins educacionais
        // Em produção, use um backend para esta etapa!
        
        // Por ora, vamos usar GitHub Device Flow ou pedir token manualmente
        // Alternativa: usar serviço como https://github-oauth-server.herokuapp.com
        
        showError('Configure o backend OAuth. Ver documentação.');
        
        // Exemplo de implementação com backend:
        /*
        const response = await fetch('https://seu-backend.com/api/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        const accessToken = data.access_token;
        
        // Salva token
        AppState.accessToken = accessToken;
        localStorage.setItem('github_token', accessToken);
        
        // Busca dados do usuário
        await fetchUserData(accessToken);
        
        // Mostra formulário
        showUploadForm();
        */
        
    } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        showError('Erro ao autenticar. Tente novamente.');
    }
}

/**
 * 🎯 FUNÇÃO: fetchUserData()
 * 
 * Busca informações do usuário autenticado.
 * 
 * 📚 GitHub API Endpoint:
 * GET https://api.github.com/user
 */
async function fetchUserData(token) {
    const response = await fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) throw new Error('Falha ao buscar dados do usuário');
    
    const userData = await response.json();
    AppState.user = userData;
    
    displayUserInfo(userData);
}

// ============================================================
// MANIPULAÇÃO DE ARQUIVOS
// ============================================================

/**
 * 🎯 FUNÇÃO: handleFileSelect()
 * 
 * Processa arquivo selecionado pelo usuário.
 * 
 * 🎓 CONCEITO: File API
 * JavaScript pode ler arquivos do computador do usuário
 * (com permissão) usando a File API.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    console.log('📁 Arquivo selecionado:', file.name);
    
    // Validações
    if (!validateFile(file)) return;
    
    // Salva no estado
    AppState.selectedFile = file;
    
    // Mostra preview
    displayFilePreview(file);
}

/**
 * 🎯 FUNÇÃO: validateFile()
 * 
 * Valida arquivo antes do upload.
 * 
 * ✅ Verificações:
 * - Tamanho (< 100 MB)
 * - Tipo (imagem ou vídeo permitido)
 * - Nome válido
 */
function validateFile(file) {
    // Verifica tamanho
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showError(`Arquivo muito grande! Máximo: ${CONFIG.MAX_FILE_SIZE / 1024 / 1024} MB`);
        return false;
    }
    
    // Verifica tipo
    const allowedTypes = [...CONFIG.ALLOWED_IMAGE_TYPES, ...CONFIG.ALLOWED_VIDEO_TYPES];
    if (!allowedTypes.includes(file.type)) {
        showError('Tipo de arquivo não permitido. Use JPG, PNG, GIF, WebP, MP4 ou WebM.');
        return false;
    }
    
    // Verifica nome
    if (!/^[\w\-. ]+$/.test(file.name)) {
        showError('Nome de arquivo contém caracteres inválidos.');
        return false;
    }
    
    return true;
}

/**
 * 🎯 FUNÇÃO: displayFilePreview()
 * 
 * Mostra preview do arquivo selecionado.
 */
function displayFilePreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const fileInfo = document.getElementById('file-info');
        const fileUploadArea = document.querySelector('.file-upload');
        
        // Cria HTML do preview
        const previewHTML = `
            <div class="file-info">
                <i class="fas fa-check-circle"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${(file.size / 1024 / 1024).toFixed(2)} MB - ${file.type}</p>
                </div>
                <button type="button" class="remove-file" onclick="removeFile()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        fileUploadArea.insertAdjacentHTML('afterend', previewHTML);
    };
    
    reader.readAsDataURL(file);
}

/**
 * 🎯 FUNÇÃO: removeFile()
 * 
 * Remove arquivo selecionado.
 */
function removeFile() {
    AppState.selectedFile = null;
    document.querySelector('.file-info')?.remove();
    document.getElementById('file-input').value = '';
}

// ============================================================
// UPLOAD PARA GITHUB
// ============================================================

/**
 * 🎯 FUNÇÃO: handleFormSubmit()
 * 
 * Processa envio do formulário.
 * 
 * 📝 FLUXO:
 * 1. Valida dados do formulário
 * 2. Faz upload do arquivo para GitHub
 * 3. Atualiza trabalhos.json
 * 4. Mostra mensagem de sucesso
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (AppState.isUploading) return;
    
    // Coleta dados do formulário
    const formData = {
        estudante: document.getElementById('student-name').value.trim(),
        titulo: document.getElementById('work-title').value.trim(),
        descricao: document.getElementById('work-description').value.trim(),
        tipo: document.querySelector('input[name="work-type"]:checked').value,
        ferramentas: document.getElementById('ai-tool').value.trim().split(',').map(t => t.trim()),
        data: new Date().toISOString().split('T')[0]
    };  
    // Valida
    if (!validateFormData(formData)) return;
    if (!AppState.selectedFile) {
        showError('Selecione um arquivo para enviar.');
        return;
    }
    
    // Inicia upload
    try {
        AppState.isUploading = true;
        showProgress(0, 'Preparando upload...');
        
        // 1. Upload do arquivo
        const fileName = generateFileName(AppState.selectedFile);
        const filePath = CONFIG.IMAGES_PATH + fileName;
        
        await uploadFileToGitHub(AppState.selectedFile, filePath);
        
        showProgress(50, 'Atualizando banco de dados...');
        
        // 2. Atualiza JSON
        formData.url = filePath;
        if (formData.tipo === 'video') {
            formData.videoUrl = filePath;
        }
        
        await updateTrabalhosJSON(formData);
        
        showProgress(100, 'Concluído!');
        
        // Sucesso!
        showSuccess();
        
    } catch (error) {
        console.error('❌ Erro no upload:', error);
        showError('Erro ao enviar trabalho: ' + error.message);
    } finally {
        AppState.isUploading = false;
    }
}

/**
 * 🎯 FUNÇÃO: uploadFileToGitHub()
 * 
 * Faz upload de arquivo para o GitHub usando a API.
 * 
 * 🔍 COMO FUNCIONA:
 * 
 * 1. Converte arquivo para Base64
 *    - GitHub API só aceita Base64
 *    - Base64 = codificação de binário em texto
 *    
 * 2. Cria/Atualiza arquivo via API
 *    - Endpoint: PUT /repos/:owner/:repo/contents/:path
 *    - Envia: conteúdo em Base64 + mensagem de commit
 *    
 * 3. GitHub cria commit automaticamente
 *    - 1 arquivo = 1 commit
 *    - Histórico preservado
 *    
 * 📚 Documentação:
 * https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
 * 
 * 🎓 CONCEITO DE IA:
 * Muitas APIs de IA (OpenAI DALL-E, Google Vision, etc)
 * também usam Base64 para envio de imagens.
 */
async function uploadFileToGitHub(file, path) {
    // Converte arquivo para Base64
    const base64Content = await fileToBase64(file);
    
    // Remove prefixo "data:image/jpeg;base64," se existir
    const content = base64Content.split(',')[1] || base64Content;
    
    // Prepara requisição
    const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${path}`;
    
    const body = {
        message: `Add: ${file.name}`,
        content: content,
        branch: CONFIG.REPO_BRANCH
    };
    
    // Envia para GitHub
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${AppState.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha no upload');
    }
    
    return await response.json();
}

/**
 * 🎯 FUNÇÃO: updateTrabalhosJSON()
 * 
 * Atualiza arquivo trabalhos.json com novo trabalho.
 * 
 * 📝 PROCESSO:
 * 1. Busca JSON atual
 * 2. Adiciona novo trabalho
 * 3. Atualiza arquivo no GitHub
 */
async function updateTrabalhosJSON(novoTrabalho) {
    // 1. Busca JSON atual
    const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${CONFIG.JSON_PATH}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${AppState.accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) throw new Error('Falha ao buscar trabalhos.json');
    
    const fileData = await response.json();
    
    // Decodifica conteúdo Base64
    const currentContent = JSON.parse(atob(fileData.content));
    
    // 2. Adiciona novo trabalho
    const proximoId = Math.max(...currentContent.trabalhos.map(t => t.id), 0) + 1;
    novoTrabalho.id = proximoId;
    
    currentContent.trabalhos.push(novoTrabalho);
    
    // 3. Atualiza no GitHub
    const newContent = btoa(JSON.stringify(currentContent, null, 2));
    
    const updateResponse = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${AppState.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add trabalho: ${novoTrabalho.titulo}`,
            content: newContent,
            sha: fileData.sha,
            branch: CONFIG.REPO_BRANCH
        })
    });
    
    if (!updateResponse.ok) throw new Error('Falha ao atualizar JSON');
    
    return await updateResponse.json();
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * 🎯 Converte File para Base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 🎯 Gera nome único para arquivo
 */
function generateFileName(file) {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
    return `${timestamp}-${safeName}`;
}

/**
 * 🎯 Gera string aleatória para CSRF protection
 */
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * 🎯 Valida dados do formulário
 */
function validateFormData(data) {
    if (!data.estudante) {
        showError('Nome do estudante é obrigatório.');
        return false;
    }
    if (!data.titulo) {
        showError('Título do trabalho é obrigatório.');
        return false;
    }
    if (!data.descricao) {
        showError('Descrição é obrigatória.');
        return false;
    }
    if (!data.ferramentas.length) {
        showError('Informe pelo menos uma ferramenta de IA.');
        return false;
    }
    return true;
}

// ============================================================
// UI - INTERFACE
// ============================================================

function showProgress(percent, message) {
    const progressSection = document.getElementById('progress-section');
    const progressFill = document.getElementById('progress-fill');
    const progressStatus = document.getElementById('progress-status');
    
    progressSection.classList.add('active');
    progressFill.style.width = percent + '%';
    progressFill.textContent = percent + '%';
    progressStatus.textContent = message;
}

function showSuccess() {
    document.getElementById('upload-form-section').classList.add('hidden');
    document.getElementById('success-message').classList.add('active');
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

function displayUserInfo(user) {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('upload-form-section').classList.remove('hidden');
    
    document.getElementById('user-avatar').src = user.avatar_url;
    document.getElementById('user-name').textContent = user.name || user.login;
    document.getElementById('user-username').textContent = '@' + user.login;
}

function setupEventListeners() {
    document.getElementById('github-login-btn')?.addEventListener('click', authenticateWithGitHub);
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.getElementById('file-input')?.addEventListener('change', handleFileSelect);
    document.getElementById('upload-form')?.addEventListener('submit', handleFormSubmit);
}

function logout() {
    localStorage.removeItem('github_token');
    AppState.user = null;
    AppState.accessToken = null;
    location.reload();
}

function checkExistingAuth() {
    const token = localStorage.getItem('github_token');
    if (token) {
        AppState.accessToken = token;
        fetchUserData(token);
    }
}

function resetForm() {
    document.getElementById('upload-form').reset();
    removeFile();
    document.getElementById('success-message').classList.remove('active');
    document.getElementById('upload-form-section').classList.remove('hidden');
    document.getElementById('progress-section').classList.remove('active');
}

// ============================================================
// LOGS E DEBUG
// ============================================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🎓 SISTEMA DE UPLOAD CARREGADO                              ║
║  Criado com GitHub Copilot para MBA em IA                    ║
╠══════════════════════════════════════════════════════════════╣
║  ℹ️  Para testar:                                             ║
║  1. Configure CLIENT_ID no topo do arquivo                   ║
║  2. Configure OAuth App no GitHub                            ║
║  3. Faça login e teste o upload                              ║
╠══════════════════════════════════════════════════════════════╣
║  📚 Explore o código e aprenda!                              ║
╚══════════════════════════════════════════════════════════════╝
`);