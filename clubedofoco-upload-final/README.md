# 🚀 Sistema de Upload - Clube do Foco

Sistema completo de upload, moderação e galeria de trabalhos dos alunos do Clube do Foco. Desenvolvido com HTML, CSS, JavaScript puro e GitHub Actions para automação.

## 📋 Características

✨ **Upload de Trabalhos**
- Drag-and-drop de arquivo
- Validação de tipo e tamanho
- Preview em tempo real
- Formulário completo com metadados

✨ **Painel de Moderação**
- Dashboard com estatísticas
- Filtros por status, tipo e busca
- Modal com preview do arquivo
- Aprovação/rejeição de uploads

✨ **Automação**
- Validação automática de JSON
- Sincronização com galeria
- Criação automática de GitHub Issues
- Proteção de branches

✨ **Integração GitHub**
- Autenticação com OAuth
- Armazenamento em GitHub
- Histórico versionado
- Sincronização com Cloudflare

## 📁 Estrutura do Projeto

```
clubedofoco-upload/
├── upload/                    # Página de upload
│   ├── index.html            # HTML principal
│   ├── css/
│   │   └── styles.css        # Estilos
│   └── js/
│       └── app.js            # Funcionalidade
├── admin/                     # Painel de moderação
│   ├── index.html            # HTML principal
│   ├── css/
│   │   └── styles.css        # Estilos
│   └── js/
│       └── app.js            # Funcionalidade
├── data/
│   ├── uploads/              # Arquivos JSON de uploads
│   └── gallery.json          # Galeria sincronizada
├── docs/                      # Documentação
│   ├── SETUP.md              # Guia de setup
│   ├── BRANCH_PROTECTION.md  # Proteção de branches
│   └── CREDENCIAIS_SETUP.md  # Guia de credenciais
├── .github/
│   ├── workflows/
│   │   └── validate-uploads.yml  # GitHub Actions
│   ├── CODEOWNERS            # Responsabilidades
│   └── ISSUE_TEMPLATE/
│       └── upload-moderation.md  # Template de issue
├── package.json              # Dependências
├── README.md                 # Este arquivo
└── .gitignore               # Arquivos ignorados
```

## 🚀 Quick Start

### 1. Clonar Repositório

```bash
git clone https://github.com/Silviosb88/ia_para_negocios.git
cd ia_para_negocios
```

### 2. Criar Branches

```bash
# Branch para upload
git checkout -b upload

# Branch para admin
git checkout -b admin

# Push para remoto
git push origin upload admin
```

### 3. Configurar Proteção de Branches

Veja [BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md) para instruções completas.

### 4. Acessar Páginas

- **Upload:** `https://clubedofoco.ia.br/upload/`
- **Moderação:** `https://clubedofoco.ia.br/admin/`

## 📝 Como Usar

### Para Alunos: Enviar Trabalho

1. Acesse: `https://clubedofoco.ia.br/upload/`
2. Preencha o formulário:
   - Selecione arquivo (máx 100MB)
   - Título do trabalho
   - Descrição detalhada
   - Tipo de conteúdo
   - Ferramentas de IA utilizadas
   - Fonte de inspiração (opcional)
   - Seu nome completo
3. Clique em "Enviar Trabalho"
4. Aguarde aprovação da moderação (até 24h)

### Para Moderadores: Revisar Uploads

1. Acesse: `https://clubedofoco.ia.br/admin/`
2. Faça login com GitHub
3. Revise uploads pendentes:
   - Verifique informações
   - Visualize arquivo
   - Aprove ou rejeite
4. Upload aprovado → Adicionado à galeria
5. Upload rejeitado → Notificação ao autor

## 🔧 Configuração de Credenciais

### GitHub OAuth

1. Vá para: `https://github.com/settings/developers`
2. Clique em "New OAuth App"
3. Preencha:
   - Application name: `Clube do Foco Upload`
   - Homepage URL: `https://clubedofoco.ia.br`
   - Authorization callback URL: `https://clubedofoco.ia.br/admin/callback`
4. Copie `Client ID` e `Client Secret`

### Arquivo .env

Crie `.env.local` na raiz do projeto:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=seu_client_id
GITHUB_CLIENT_SECRET=seu_client_secret
GITHUB_OAUTH_TOKEN=seu_token
GITHUB_REPO_OWNER=Silviosb88
GITHUB_REPO_NAME=ia_para_negocios

# JWT (para sessões)
JWT_SECRET=gere_uma_string_aleatoria
JWT_EXPIRATION=7d
```

Para gerar JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Estrutura de Dados

### Upload JSON

```json
{
  "id": "UPL001",
  "title": "Avatar IA com Synthesia",
  "author": "João Silva",
  "type": "avatar",
  "description": "Avatar digital criado com Synthesia...",
  "tools": ["Synthesia", "Adobe Firefly"],
  "source": "Tutorial YouTube",
  "status": "pending",
  "date": "2026-02-14",
  "file": "avatar-synthesia.mp4"
}
```

### Status

- `pending` - Aguardando moderação
- `approved` - Aprovado, visível na galeria
- `rejected` - Rejeitado, não visível

### Tipos

- `imagem` - Imagens estáticas
- `video` - Vídeos
- `avatar` - Avatares digitais
- `audio` - Áudio/Música
- `outro` - Outros tipos

## 🔄 Fluxo de Moderação

```
1. Aluno envia upload
   ↓
2. GitHub Actions valida JSON
   ↓
3. GitHub Issue criada automaticamente
   ↓
4. Moderador revisa no painel
   ↓
5. Moderador aprova/rejeita
   ↓
6. Se aprovado:
   - Arquivo movido para galeria
   - gallery.json atualizado
   - Aluno notificado
   ↓
7. Se rejeitado:
   - Aluno notificado com motivo
   - Upload removido
```

## 🤖 GitHub Actions

### Validação de Uploads

Arquivo: `.github/workflows/validate-uploads.yml`

**Executa em:**
- Push para `main` ou `upload`
- Pull Request para `main`

**Valida:**
- ✅ JSON válido
- ✅ Schema correto
- ✅ Sem duplicatas
- ✅ Campos obrigatórios

**Sincroniza:**
- ✅ Galeria com uploads aprovados
- ✅ Cria GitHub Issues
- ✅ Atualiza estatísticas

## 📚 Documentação

- [SETUP.md](docs/SETUP.md) - Guia de configuração completo
- [BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md) - Proteção de branches
- [CREDENCIAIS_SETUP.md](docs/CREDENCIAIS_SETUP.md) - Guia de credenciais
- [API.md](docs/API.md) - Documentação de API

## 🛡️ Segurança

- ✅ Validação de arquivo (tipo, tamanho)
- ✅ Sanitização de input
- ✅ Autenticação GitHub OAuth
- ✅ Proteção de branch (requer PR)
- ✅ CODEOWNERS para revisão
- ✅ Sem force pushes permitidos

## 🐛 Troubleshooting

### Upload não aparece na galeria

1. Verifique status: `pending` → `approved`
2. Verifique GitHub Actions: `Actions` tab
3. Verifique `gallery.json` foi atualizado
4. Limpe cache do navegador

### Erro de validação JSON

1. Verifique sintaxe JSON
2. Use: `node -e "JSON.parse(require('fs').readFileSync('arquivo.json'))"`
3. Verifique campos obrigatórios
4. Verifique tipos válidos

### GitHub Actions falhando

1. Verifique logs: `Actions` tab
2. Verifique status checks: `Settings → Branches`
3. Verifique CODEOWNERS: `.github/CODEOWNERS`
4. Verifique credenciais: `.env.local`

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique documentação em `docs/`
2. Crie uma GitHub Issue
3. Entre em contato: contato@clubedofoco.ia.br

## 📄 Licença

Este projeto é parte do Clube do Foco - MBA de IA para Negócios.

## 🙏 Créditos

Desenvolvido com ❤️ e [Manus IA](https://manus.im)

**Versão:** 2.1  
**Última atualização:** Fevereiro de 2026

---

## 🎯 Roadmap

### v2.1 (Atual)
- ✅ Página de upload
- ✅ Painel de moderação
- ✅ GitHub Actions
- ✅ Proteção de branches

### v2.2 (Planejado)
- 🔄 Notificações por email
- 🔄 Dashboard de estatísticas
- 🔄 Sistema de comentários
- 🔄 Busca avançada

### v3.0 (Futuro)
- 🔄 Backend com Node.js
- 🔄 Banco de dados
- 🔄 API REST
- 🔄 Mobile app
