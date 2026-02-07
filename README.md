# 🤖 MBA IA para Negócios - Galeria de Trabalhos

Galeria web moderna e responsiva para exibição dos projetos desenvolvidos pelos estudantes do MBA em Inteligência Artificial para Negócios.

## 📋 Sobre o Projeto

Esta galeria permite visualizar trabalhos criados com ferramentas de IA, incluindo:
- 🖼️ **Imagens** geradas com MidJourney, DALL-E, Adobe Firefly
- 🎥 **Vídeos** criados com Runway ML, Synthesia, HeyGen
- 👤 **Avatares** desenvolvidos com D-ID, Murf AI

## 🚀 Como Visualizar a Galeria

### Opção 1: Visualização Local

1. Clone este repositório:
```bash
git clone https://github.com/Silviosb88/ia_para_negocios.git
cd ia_para_negocios
```

2. Abra o arquivo `index.html` diretamente no navegador, ou inicie um servidor local:

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (se tiver http-server instalado)
npx http-server -p 8080
```

3. Acesse no navegador: `http://localhost:8080`

### Opção 2: GitHub Pages (Recomendado)

1. Acesse as configurações do repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione a branch padrão do repositório (por exemplo, `main`)
4. Selecione a pasta `/ (root)`
5. Clique em **Save**
6. Aguarde alguns minutos e acesse: `https://silviosb88.github.io/ia_para_negocios/`

## 📁 Estrutura de Arquivos

```
ia_para_negocios/
├── index.html              # Página principal da galeria
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   └── app.js             # Lógica e interatividade
├── data/
│   └── trabalhos.json     # Dados dos projetos
└── README.md              # Documentação
```

## ➕ Como Adicionar Novos Trabalhos

### Passo 1: Preparar a Mídia

Faça upload das imagens/vídeos em uma destas opções:

**Opção A - GitHub (Recomendado para imagens pequenas):**
1. Crie uma pasta `assets/` no repositório
2. Faça upload da imagem
3. Use o caminho: `assets/nome-arquivo.jpg`

**Opção B - Serviços de Hospedagem Externos:**
- **Imgur**: https://imgur.com (imagens)
- **Google Drive**: Compartilhe e use o link direto
- **YouTube**: Para vídeos (use o link embed)
- **Vimeo**: Para vídeos profissionais

**Para converter link do YouTube em embed:**
- Link original: `https://www.youtube.com/watch?v=ABC123`
- Link embed: `https://www.youtube.com/embed/ABC123`

### Passo 2: Editar o Arquivo JSON

Abra o arquivo `data/trabalhos.json` e adicione um novo objeto no array `galeria_projetos`:

```json
{
  "codigo": "PRJ007",
  "autor": "Seu Nome Completo",
  "modalidade": "imagem",
  "titulo_obra": "Título do Seu Trabalho",
  "resumo": "Descrição detalhada do projeto e técnicas utilizadas",
  "arquivo_preview": "URL_DA_SUA_IMAGEM",
  "timestamp": "2026-02-06",
  "stack_ia": ["Ferramenta 1", "Ferramenta 2"]
}
```

**Para vídeos**, adicione também:
```json
"link_streaming": "https://www.youtube.com/embed/SEU_VIDEO_ID"
```

### Passo 3: Commit e Push

```bash
git add data/trabalhos.json
git commit -m "Adicionar projeto: [Nome do Projeto]"
git push origin main
```

## 🎨 Tipos de Trabalho e Modalidades

### Imagens (`modalidade: "imagem"`)
- Geração de arte com IA
- Logos e identidades visuais
- Ilustrações conceituais
- Edição e manipulação de imagens

**Badge**: Azul (#4F46E5)

### Vídeos (`modalidade: "video"`)
- Animações geradas por IA
- Vídeos explicativos
- Motion graphics
- Edição automatizada

**Badge**: Roxo (#8B5CF6)

### Avatares (`modalidade: "avatar"`)
- Avatares digitais humanizados
- Assistentes virtuais
- Porta-vozes corporativos
- Personagens animados

**Badge**: Verde (#10B981)

## 🔍 Funcionalidades da Galeria

### Filtros
- **Todos**: Exibe todos os projetos
- **Imagens**: Apenas trabalhos de imagem
- **Vídeos**: Apenas conteúdo em vídeo
- **Avatares**: Apenas avatares digitais

### Busca
- Busca em tempo real por nome do estudante
- Resultados instantâneos conforme você digita
- Case-insensitive (maiúsculas/minúsculas não importam)

### Visualização
- Clique em qualquer card para ver em tamanho maior
- Modal com informações completas do projeto
- Navegação entre projetos (setas ou teclado)
- Player de vídeo integrado para conteúdo audiovisual

### Responsividade
- **Mobile** (até 768px): 1 coluna
- **Tablet** (768px - 1024px): 2 colunas
- **Desktop** (acima de 1024px): 3-4 colunas

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, Animações, Variáveis CSS
- **JavaScript ES6+**: Fetch API, Manipulação do DOM
- **JSON**: Armazenamento de dados

## 👥 Como Contribuir

### Para Estudantes

1. **Fork** este repositório
2. Adicione seu trabalho ao arquivo `data/trabalhos.json`
3. Se necessário, adicione suas imagens na pasta `assets/`
4. Crie um **Pull Request** com a descrição:
   - Seu nome
   - Tipo de trabalho
   - Ferramentas utilizadas

### Diretrizes de Contribuição

- Use URLs válidas e acessíveis para mídias
- Preencha todos os campos obrigatórios do JSON
- Mantenha descrições claras e profissionais
- Teste localmente antes de enviar o PR
- Um projeto por Pull Request

## 📝 Formato do JSON

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `codigo` | String | Identificador único (ex: PRJ007) |
| `autor` | String | Nome completo do estudante |
| `modalidade` | String | Tipo: "imagem", "video" ou "avatar" |
| `titulo_obra` | String | Título do projeto |
| `resumo` | String | Descrição do trabalho |
| `arquivo_preview` | String | URL da thumbnail/preview |
| `timestamp` | String | Data no formato YYYY-MM-DD |
| `stack_ia` | Array | Lista de ferramentas IA usadas |

### Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `link_streaming` | String | URL do vídeo embed (apenas para vídeos) |

## 🎯 Exemplos de Prompts e Ferramentas

### MidJourney
```
/imagine corporate futuristic office with holographic displays, 
photorealistic, 8k, professional lighting --ar 16:9 --v 6
```

### DALL-E 3
```
Create a modern logo for an AI consulting company, 
minimalist design, blue and purple gradient, vector style
```

### Runway ML
- Text-to-Video: Converta descrições em vídeos
- Motion Brush: Anime partes específicas de imagens

### Synthesia
- Crie vídeos com avatares IA
- Suporte para múltiplos idiomas
- Sincronização labial realista

## 📱 Acessibilidade

A galeria foi desenvolvida com foco em acessibilidade:

- ✅ Navegação por teclado (Tab, Enter, Esc, Setas)
- ✅ ARIA labels para leitores de tela
- ✅ Alt text em todas as imagens
- ✅ Contraste adequado de cores
- ✅ Foco visível em elementos interativos

## 🐛 Resolução de Problemas

### Imagens não aparecem
- Verifique se a URL está acessível publicamente
- Teste a URL diretamente no navegador
- Certifique-se de usar HTTPS (não HTTP)

### Vídeo não carrega
- Use URLs embed (não URLs normais)
- YouTube: `/embed/VIDEO_ID`
- Vimeo: `https://player.vimeo.com/video/VIDEO_ID`

### Projeto não aparece na galeria
- Valide o JSON em https://jsonlint.com
- Verifique vírgulas e aspas
- Certifique-se que `modalidade` é "imagem", "video" ou "avatar"

### GitHub Pages não atualiza
- Aguarde 2-5 minutos após o push
- Force refresh: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)
- Limpe o cache do navegador

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma **Issue** neste repositório
2. Entre em contato com a coordenação do MBA
3. Consulte a documentação das ferramentas IA utilizadas

## 📄 Licença

Este projeto é educacional e destinado aos estudantes do MBA IA para Negócios.

---

**Desenvolvido com** 🤖 **e** ❤️ **pelos estudantes do MBA IA para Negócios**

*Última atualização: 06 de Fevereiro de 2026*
