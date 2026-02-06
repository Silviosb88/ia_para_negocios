// ===== CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS =====
const configuracaoApp = {
    caminhoArquivoDados: 'data/trabalhos.json',
    tempoAnimacaoMs: 300,
    mensagemErroCarregamento: 'Não foi possível carregar os projetos. Tente novamente mais tarde.',
    mensagemNenhumResultado: 'Nenhum trabalho encontrado com os filtros aplicados.'
};

let listaProjetos = [];
let projetosFiltrados = [];
let categoriaAtual = 'todos';
let termoBusca = '';
let indiceProjetoVisualizado = -1;

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacao();
});

function inicializarAplicacao() {
    configurarEventosInterface();
    carregarDadosProjetos();
}

// ===== CARREGAMENTO DE DADOS =====
async function carregarDadosProjetos() {
    try {
        const resposta = await fetch(configuracaoApp.caminhoArquivoDados);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        listaProjetos = dados.galeria_projetos || [];
        projetosFiltrados = [...listaProjetos];
        
        renderizarGaleria();
        atualizarContadorResultados();
        
    } catch (erro) {
        console.error('Erro ao carregar projetos:', erro);
        exibirMensagemErro(configuracaoApp.mensagemErroCarregamento);
    }
}

// ===== CONFIGURAÇÃO DE EVENTOS =====
function configurarEventosInterface() {
    const botoesFiltro = document.querySelectorAll('.botao-categoria');
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', gerenciarCliqueFiltro);
    });
    
    const campoBusca = document.getElementById('campo-busca-estudante');
    if (campoBusca) {
        campoBusca.addEventListener('input', gerenciarDigitacaoBusca);
    }
    
    const botaoFechar = document.querySelector('.botao-fechar-modal');
    if (botaoFechar) {
        botaoFechar.addEventListener('click', fecharModal);
    }
    
    const fundoModal = document.querySelector('.fundo-escurecido');
    if (fundoModal) {
        fundoModal.addEventListener('click', fecharModal);
    }
    
    const botaoAnterior = document.getElementById('botao-anterior');
    if (botaoAnterior) {
        botaoAnterior.addEventListener('click', navegarProjetoAnterior);
    }
    
    const botaoProximo = document.getElementById('botao-proximo');
    if (botaoProximo) {
        botaoProximo.addEventListener('click', navegarProjetoProximo);
    }
    
    document.addEventListener('keydown', gerenciarTeclasNavegacao);
}

// ===== GERENCIAMENTO DE FILTROS =====
function gerenciarCliqueFiltro(evento) {
    const botaoClicado = evento.currentTarget;
    const filtroSelecionado = botaoClicado.getAttribute('data-filtro');
    
    const todosBotoes = document.querySelectorAll('.botao-categoria');
    todosBotoes.forEach(btn => btn.classList.remove('ativo'));
    botaoClicado.classList.add('ativo');
    
    categoriaAtual = filtroSelecionado;
    aplicarFiltragem();
}

function gerenciarDigitacaoBusca(evento) {
    termoBusca = evento.target.value.trim();
    aplicarFiltragem();
}

// ===== ALGORITMO CUSTOMIZADO DE FILTRAGEM =====
function aplicarFiltragem() {
    const resultadosTemporarios = [];
    
    for (let i = 0; i < listaProjetos.length; i++) {
        const projeto = listaProjetos[i];
        let incluirProjeto = true;
        
        if (categoriaAtual !== 'todos') {
            if (projeto.modalidade !== categoriaAtual) {
                incluirProjeto = false;
            }
        }
        
        if (incluirProjeto && termoBusca !== '') {
            const nomeAutor = projeto.autor.toLowerCase();
            const termoBuscaLower = termoBusca.toLowerCase();
            
            let encontrou = false;
            for (let j = 0; j <= nomeAutor.length - termoBuscaLower.length; j++) {
                let corresponde = true;
                for (let k = 0; k < termoBuscaLower.length; k++) {
                    if (nomeAutor[j + k] !== termoBuscaLower[k]) {
                        corresponde = false;
                        break;
                    }
                }
                if (corresponde) {
                    encontrou = true;
                    break;
                }
            }
            
            if (!encontrou) {
                incluirProjeto = false;
            }
        }
        
        if (incluirProjeto) {
            resultadosTemporarios.push(projeto);
        }
    }
    
    projetosFiltrados = resultadosTemporarios;
    renderizarGaleria();
    atualizarContadorResultados();
}

// ===== RENDERIZAÇÃO DA GALERIA =====
function renderizarGaleria() {
    const container = document.getElementById('painel-obras-mba');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (projetosFiltrados.length === 0) {
        const mensagem = criarElementoMensagem(configuracaoApp.mensagemNenhumResultado);
        container.appendChild(mensagem);
        return;
    }
    
    for (let i = 0; i < projetosFiltrados.length; i++) {
        const projeto = projetosFiltrados[i];
        const cartao = construirCartaoProjeto(projeto, i);
        container.appendChild(cartao);
    }
}

// ===== CONSTRUÇÃO CUSTOMIZADA DO CARTÃO =====
function construirCartaoProjeto(projeto, indice) {
    const artigo = document.createElement('article');
    artigo.className = 'cartao-trabalho-estudante';
    artigo.setAttribute('data-indice', indice);
    artigo.addEventListener('click', () => abrirModal(indice));
    
    const containerImagem = document.createElement('div');
    containerImagem.className = 'container-imagem-cartao';
    
    const imagem = document.createElement('img');
    imagem.src = projeto.arquivo_preview;
    imagem.alt = projeto.titulo_obra;
    imagem.className = 'imagem-preview-projeto';
    imagem.loading = 'lazy';
    
    const selo = document.createElement('span');
    selo.className = `selo-modalidade tipo-${projeto.modalidade}`;
    selo.textContent = projeto.modalidade;
    
    containerImagem.appendChild(imagem);
    containerImagem.appendChild(selo);
    
    const conteudo = document.createElement('div');
    conteudo.className = 'conteudo-cartao';
    
    const titulo = document.createElement('h3');
    titulo.className = 'titulo-trabalho';
    titulo.textContent = projeto.titulo_obra;
    
    const autor = document.createElement('p');
    autor.className = 'autor-trabalho';
    autor.textContent = projeto.autor;
    
    const resumo = document.createElement('p');
    resumo.className = 'resumo-trabalho';
    resumo.textContent = projeto.resumo;
    
    const listaFerramentas = document.createElement('div');
    listaFerramentas.className = 'lista-ferramentas';
    
    if (projeto.stack_ia && Array.isArray(projeto.stack_ia)) {
        for (let i = 0; i < projeto.stack_ia.length; i++) {
            const etiqueta = document.createElement('span');
            etiqueta.className = 'etiqueta-ferramenta';
            etiqueta.textContent = projeto.stack_ia[i];
            listaFerramentas.appendChild(etiqueta);
        }
    }
    
    const timestamp = document.createElement('p');
    timestamp.className = 'info-timestamp';
    timestamp.textContent = formatarData(projeto.timestamp);
    
    conteudo.appendChild(titulo);
    conteudo.appendChild(autor);
    conteudo.appendChild(resumo);
    conteudo.appendChild(listaFerramentas);
    conteudo.appendChild(timestamp);
    
    artigo.appendChild(containerImagem);
    artigo.appendChild(conteudo);
    
    return artigo;
}

// ===== GERENCIAMENTO DO MODAL =====
function abrirModal(indice) {
    indiceProjetoVisualizado = indice;
    const projeto = projetosFiltrados[indice];
    
    if (!projeto) return;
    
    preencherDadosModal(projeto);
    
    const modal = document.getElementById('janela-ampliacao');
    if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    atualizarBotoesNavegacao();
}

function preencherDadosModal(projeto) {
    const imagemModal = document.getElementById('imagem-ampliada');
    const videoModal = document.getElementById('video-incorporado');
    
    if (projeto.modalidade === 'video' && projeto.link_streaming) {
        imagemModal.style.display = 'none';
        videoModal.style.display = 'block';
        videoModal.src = projeto.link_streaming;
    } else {
        videoModal.style.display = 'none';
        imagemModal.style.display = 'block';
        imagemModal.src = projeto.arquivo_preview;
        imagemModal.alt = projeto.titulo_obra;
    }
    
    const etiqueta = document.getElementById('etiqueta-modalidade');
    if (etiqueta) {
        etiqueta.className = `emblema-tipo tipo-${projeto.modalidade}`;
        etiqueta.textContent = projeto.modalidade;
    }
    
    const titulo = document.getElementById('titulo-projeto-modal');
    if (titulo) titulo.textContent = projeto.titulo_obra;
    
    const autor = document.getElementById('autor-projeto-modal');
    if (autor) autor.textContent = `Por: ${projeto.autor}`;
    
    const codigo = document.getElementById('codigo-projeto-modal');
    if (codigo) codigo.textContent = `Código: ${projeto.codigo}`;
    
    const descricao = document.getElementById('descricao-projeto-modal');
    if (descricao) descricao.textContent = projeto.resumo;
    
    const containerTecnologias = document.getElementById('ferramentas-utilizadas');
    if (containerTecnologias) {
        containerTecnologias.innerHTML = '';
        
        if (projeto.stack_ia && Array.isArray(projeto.stack_ia)) {
            for (let i = 0; i < projeto.stack_ia.length; i++) {
                const chip = document.createElement('span');
                chip.className = 'chip-tecnologia';
                chip.textContent = projeto.stack_ia[i];
                containerTecnologias.appendChild(chip);
            }
        }
    }
    
    const data = document.getElementById('data-projeto-modal');
    if (data) data.textContent = `Data de criação: ${formatarData(projeto.timestamp)}`;
}

function fecharModal() {
    const modal = document.getElementById('janela-ampliacao');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    const videoModal = document.getElementById('video-incorporado');
    if (videoModal) {
        videoModal.src = '';
    }
    
    indiceProjetoVisualizado = -1;
}

// ===== NAVEGAÇÃO ENTRE PROJETOS =====
function navegarProjetoAnterior() {
    if (indiceProjetoVisualizado > 0) {
        abrirModal(indiceProjetoVisualizado - 1);
    }
}

function navegarProjetoProximo() {
    if (indiceProjetoVisualizado < projetosFiltrados.length - 1) {
        abrirModal(indiceProjetoVisualizado + 1);
    }
}

function atualizarBotoesNavegacao() {
    const botaoAnterior = document.getElementById('botao-anterior');
    const botaoProximo = document.getElementById('botao-proximo');
    
    if (botaoAnterior) {
        botaoAnterior.disabled = indiceProjetoVisualizado <= 0;
    }
    
    if (botaoProximo) {
        botaoProximo.disabled = indiceProjetoVisualizado >= projetosFiltrados.length - 1;
    }
}

function gerenciarTeclasNavegacao(evento) {
    const modal = document.getElementById('janela-ampliacao');
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    
    if (evento.key === 'Escape') {
        fecharModal();
    } else if (evento.key === 'ArrowLeft') {
        navegarProjetoAnterior();
    } else if (evento.key === 'ArrowRight') {
        navegarProjetoProximo();
    }
}

// ===== UTILITÁRIOS =====
function atualizarContadorResultados() {
    const contador = document.getElementById('contador-resultados');
    if (!contador) return;
    
    const total = projetosFiltrados.length;
    const totalGeral = listaProjetos.length;
    
    let textoContador = '';
    
    if (categoriaAtual === 'todos' && termoBusca === '') {
        textoContador = `Exibindo ${total} trabalho${total !== 1 ? 's' : ''} no total`;
    } else {
        textoContador = `Encontrado${total !== 1 ? 's' : ''} ${total} trabalho${total !== 1 ? 's' : ''} de ${totalGeral}`;
    }
    
    contador.textContent = textoContador;
}

function formatarData(dataString) {
    if (!dataString) return 'Data não disponível';
    
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const ano = partes[0];
    const mesNumero = parseInt(partes[1], 10);
    const dia = partes[2];
    
    const mesNome = meses[mesNumero - 1] || partes[1];
    
    return `${dia} de ${mesNome} de ${ano}`;
}

function criarElementoMensagem(texto) {
    const div = document.createElement('div');
    div.style.gridColumn = '1 / -1';
    div.style.textAlign = 'center';
    div.style.padding = '3rem';
    div.style.color = 'var(--cor-texto-secundario)';
    div.style.fontSize = '1.1rem';
    
    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;
    
    div.appendChild(paragrafo);
    return div;
}

function exibirMensagemErro(mensagem) {
    const container = document.getElementById('painel-obras-mba');
    if (!container) return;
    
    container.innerHTML = '';
    
    const elementoErro = criarElementoMensagem(mensagem);
    elementoErro.style.color = '#EF4444';
    
    container.appendChild(elementoErro);
}

// ===== EXPORTAÇÃO (se necessário para testes) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        aplicarFiltragem,
        formatarData,
        construirCartaoProjeto
    };
}
