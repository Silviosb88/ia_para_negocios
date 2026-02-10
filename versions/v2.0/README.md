# 🎓 MBA IA para Negócios - Galeria de Trabalhos

![Badge](https://img.shields.io/badge/IA-Para%20Neg%C3%B3cios-blue)
![Badge](https://img.shields.io/badge/Status-Ativo-success)

Galeria interativa e moderna para exibir os trabalhos dos estudantes do MBA de Inteligência Artificial para Negócios. Apresenta imagens, vídeos e avatares criados com ferramentas de IA.

## 🚀 Demo

**Acesse a galeria ao vivo:** [https://silviosb88.github.io/ia_para_negocios/](https://silviosb88.github.io/ia_para_negocios/)

## ✨ Funcionalidades

- 🎨 **Design Moderno e Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🔍 **Busca em Tempo Real** - Encontre trabalhos por nome do estudante ou título
- 🎯 **Filtros por Categoria** - Filtre por imagens, vídeos ou avatares
- 🖼️ **Modal de Visualização** - Veja os trabalhos em tamanho maior com navegação
- 📊 **Contador Dinâmico** - Veja quantos trabalhos estão sendo exibidos
- ⚡ **Performance Otimizada** - Carregamento rápido e animações suaves

## 📁 Estrutura do Projeto

```
ia_para_negocios/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos da aplicação
├── js/
│   └── app.js            # Lógica e interatividade
├── data/
│   └── trabalhos.json    # Base de dados dos trabalhos
└── README.md             # Este arquivo
```

## 🎯 Como Adicionar Novos Trabalhos

### Passo 1: Edite o arquivo JSON

Abra o arquivo `data/trabalhos.json` e adicione um novo objeto ao array `trabalhos`:

```json
{
  "id": 7,
  "estudante": "Seu Nome",
  "tipo": "imagem",
  "titulo": "Título do Seu Trabalho",
  "descricao": "Descrição detalhada do trabalho",
  "url": "URL_DA_SUA_IMAGEM",
  "videoUrl": "URL_DO_VIDEO (apenas se tipo for 'video')",
  "data": "2026-02-07",
  "ferramentas": ["MidJourney", "ChatGPT"]
}
```

### Tipos Disponíveis:
- "imagem" - Para imagens geradas por IA
- "video" - Para vídeos
- "avatar" - Para avatares digitais

### Passo 2: Hospede Suas Mídias

Você pode usar:
- **GitHub** - Faça upload na pasta `images/` do repositório
- **Google Drive** - Compartilhe o link público
- **YouTube/Vimeo** - Para vídeos

### Passo 3: Commit e Push

```bash
git add data/trabalhos.json
git commit -m "Adicionar trabalho de [Seu Nome]"
git push origin main
```

A galeria será atualizada automaticamente! 🎉

## 🌐 Como Ativar o GitHub Pages

1. Acesse seu repositório no GitHub
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - Branch: `main`
   - Folder: `/ (root)`
5. Clique em **Save**
6. Aguarde 2-3 minutos
7. Sua página estará disponível em: `https://silviosb88.github.io/ia_para_negocios/`

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript (ES6+)** - Lógica e interatividade
- **Font Awesome** - Ícones
- **GitHub Pages** - Hospedagem gratuita

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Dispositivos móveis (iOS e Android)
- ✅ Tablets
- ✅ Desktops

## 🎨 Customização

### Alterar Cores

Edite as variáveis CSS no arquivo `css/styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* Adicione suas cores aqui */
}
```

### Alterar Textos

Edite diretamente o arquivo `index.html` para mudar:
- Título do header
- Textos dos botões
- Mensagens do rodapé

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Exemplos de Ferramentas de IA Suportadas

- **Imagens:** MidJourney, DALL-E, Stable Diffusion, Leonardo.ai
- **Vídeos:** Runway, Synthesia, Pictory, InVideo
- **Avatares:** D-ID, HeyGen, Synthesia, Hour One
- **Edição:** Photoshop AI, Canva AI, Remove.bg
- **Texto:** ChatGPT, Claude, Gemini

---

⭐ **Em Desenvolvimento pelo Clube do Foco com ❤️ - estudantes do MBA de IA para Negócios**