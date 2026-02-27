# 📁 Estrutura do Projeto - Clube do Foco

**Repositório:** [github.com/Silviosb88/ia_para_negocios](https://github.com/Silviosb88/ia_para_negocios)  
**Versão Atual:** 2.1.0  
**Próxima Versão:** 2.1.1 (documentação colaborativa)  
**Última Atualização:** 19 de Fevereiro de 2026

> **📌 NOTA:** Esta estrutura representa o estado **ATUAL** do projeto.  
> Arquivos marcados com ✨ serão adicionados na versão 2.1.1.

---

## 🌳 Árvore Completa de Arquivos

**Legenda:**  
📄 = Arquivo existente  
📁 = Pasta existente  
✨ = Novo na v2.1.1 (a ser adicionado)

```
ia_para_negocios/
│
├── 📄 index.html                         # Galeria principal de trabalhos
├── 📄 README.md                          # Documentação principal
├── ✨ CONTRIBUTORS.md                    # Lista de IAs colaboradoras (NOVO)
├── ✨ CHANGELOG.md                       # Histórico de versões (NOVO)
├── ✨ GUIA-USO-OTIMIZADO-IAs.md         # Roteiro de uso de IAs (NOVO)
├── ✨ manifesto-ia-colaboracao.html     # Manifesto multi-IA (NOVO)
├── ✨ ESTRUTURA.md                       # Este arquivo (NOVO)
├── 📄 principais-ias.html               # Comparativo de ferramentas de IA
├── 📄 upload.html                        # Página de upload (legado)
├── 📄 CNAME                              # Domínio: clubedofoco.ia.br
├── 📄 .gitignore                         # Arquivos ignorados pelo Git
├── 📄 .env.example                       # Exemplo de variáveis de ambiente
├── 📄 QUICK_START.md                     # Guia rápido de início
├── 📄 UPLOAD_SYSTEM_README.md            # Documentação do sistema de upload
├── 📄 todo.md                            # Lista de tarefas pendentes
├── 📄 package.json                       # Dependências Node.js
├── 📄 pnpm-lock.yaml                     # Lock de dependências (pnpm)
├── 📄 tsconfig.json                      # Configuração TypeScript
├── 📄 vite.config.ts                     # Configuração Vite
├── 📄 vitest.config.ts                   # Configuração de testes
├── 📄 drizzle.config.ts                  # Configuração banco de dados
├── 📄 components.json                    # Configuração componentes UI
│
├── 📁 .github/                           # Configurações do GitHub
│   └── workflows/                        # GitHub Actions
│       └── 📄 validate.yml              # Validação automática
│
├── 📁 css/                               # Estilos globais (site estático)
│   ├── 📄 styles.css                    # CSS principal da galeria
│   └── 📄 upload.css                    # CSS do upload
│
├── 📁 js/                                # Scripts globais (site estático)
│   ├── 📄 app.js                        # JavaScript principal da galeria
│   └── 📄 upload.js                     # JavaScript do upload
│
├── 📁 data/                              # Dados do sistema
│   ├── 📄 trabalhos.json                # Trabalhos da galeria
│   └── images/                          # Mídia dos trabalhos
│       ├── .gitkeep
│       └── [diversos arquivos de mídia]
│
├── 📁 upload/                            # Sistema de upload (HTML)
│   ├── 📄 index.html                     # Página de envio
│   ├── css/
│   │   └── 📄 styles.css                # Estilos do upload
│   └── js/
│       └── 📄 app.js                    # Lógica de upload
│
├── 📁 admin/                             # Painel de moderação (HTML)
│   ├── 📄 index.html                     # Dashboard de moderação
│   ├── css/
│   │   └── 📄 styles.css                # Estilos do painel
│   └── js/
│       └── 📄 app.js                    # Lógica de moderação
│
├── 📁 docs/                              # Documentação educacional ✅ COMPLETO
│   ├── 📄 index.html                     # Hub de documentação
│   ├── 📄 recursos-gratuitos.html       # Recursos para estudantes ✅
│   ├── 📄 BRANCH_PROTECTION.md          # Guia de proteção de branches
│   ├── 📄 INSTALLATION.md               # Instruções de instalação
│   ├── 📄 INSTRUCOES-GITHUB-COPILOT.md # Guia do Copilot
│   ├── 📄 TESTING.md                    # Guia de testes
│   │
│   ├── assets/                          # Recursos da documentação
│   │   ├── 📄 docs.css                  # Estilos da documentação
│   │   └── 📄 docs.js                   # Scripts da documentação
│   │
│   └── guia/                            # Guias passo a passo ✅ COMPLETO
│       ├── 📄 fundamentos.html          # Fase 1: Fundamentos ✅
│       ├── 📄 preparacao.html           # Fase 2: Preparação ✅
│       ├── 📄 desenvolvimento.html      # Fase 3: Desenvolvimento ✅
│       ├── 📄 deploy.html               # Fase 4: Deploy ✅
│       ├── 📄 manutencao.html           # Fase 5: Manutenção ✅
│       └── 📄 recursos-gratuitos.html   # Recursos (duplicado)
│
├── 📁 versions/                          # Versões anteriores
│   ├── 📄 index.html                     # Índice de versões
│   ├── v1.0/
│   │   ├── 📄 index.html
│   │   └── 📄 README.md
│   └── v2.0/
│       ├── 📄 index.html
│       └── 📄 README.md
│
├── 📁 upload-docs/                       # Documentação do sistema de upload
│   ├── 📄 BRANCH_PROTECTION.md
│   ├── 📄 INSTALLATION.md
│   └── 📄 TESTING.md
│
├── 📁 client/                            # Frontend React (Aplicação Moderna)
│   ├── 📄 index.html                     # HTML principal do React
│   │
│   ├── public/                          # Assets públicos
│   │   ├── .gitkeep
│   │   ├── 📄 landing.html              # Landing page
│   │   └── __manus__/                   # Integração Manus IA
│   │       └── 📄 debug-collector.js
│   │
│   └── src/                             # Código fonte React
│       ├── 📄 App.tsx                    # Componente principal
│       ├── 📄 main.tsx                   # Entry point
│       ├── 📄 const.ts                   # Constantes
│       ├── 📄 index.css                  # Estilos globais
│       │
│       ├── components/                   # Componentes React
│       │   ├── 📄 AIChatBox.tsx         # Chat com IA
│       │   ├── 📄 DashboardLayout.tsx   # Layout do dashboard
│       │   ├── 📄 ErrorBoundary.tsx     # Tratamento de erros
│       │   ├── 📄 ManusDialog.tsx       # Dialog Manus IA
│       │   ├── 📄 Map.tsx               # Componente de mapa
│       │   └── ui/                      # Componentes UI (shadcn/ui)
│       │       ├── accordion.tsx
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── dialog.tsx
│       │       └── [60+ componentes...]
│       │
│       ├── contexts/                    # Context API
│       │   └── 📄 ThemeContext.tsx      # Tema claro/escuro
│       │
│       ├── data/                        # Dados do cliente
│       │   └── 📄 trabalhos.json        # Trabalhos (cache local)
│       │
│       ├── hooks/                       # Custom hooks
│       │   ├── 📄 useComposition.ts
│       │   ├── 📄 useMobile.tsx
│       │   └── 📄 usePersistFn.ts
│       │
│       ├── lib/                         # Bibliotecas auxiliares
│       │   ├── 📄 trpc.ts               # Cliente tRPC
│       │   └── 📄 utils.ts              # Utilitários
│       │
│       ├── pages/                       # Páginas React
│       │   ├── 📄 Dashboard.tsx         # Dashboard principal
│       │   ├── 📄 Home.tsx              # Página inicial
│       │   ├── 📄 Upload.tsx            # Upload moderno
│       │   ├── 📄 Moderation.tsx        # Moderação
│       │   ├── 📄 ContentManager.tsx    # Gerenciador de conteúdo
│       │   ├── 📄 Profile.tsx           # Perfil de usuário
│       │   ├── 📄 Docs.tsx              # Documentação
│       │   ├── 📄 ComponentShowcase.tsx # Showcase de componentes
│       │   └── 📄 NotFound.tsx          # Página 404
│       │
│       └── _core/                       # Core do sistema
│           └── hooks/
│               └── 📄 useAuth.ts        # Autenticação
│
├── 📁 server/                            # Backend Node.js + tRPC
│   ├── 📄 index.ts                       # Entry point do servidor
│   ├── 📄 db.ts                          # Conexão banco de dados
│   ├── 📄 db-uploads.ts                  # Lógica de uploads BD
│   ├── 📄 storage.ts                     # Sistema de armazenamento
│   ├── 📄 routers.ts                     # Routers principais tRPC
│   ├── 📄 routers-uploads.ts            # Router de uploads
│   ├── 📄 routers-uploads.test.ts       # Testes de uploads
│   ├── 📄 auth.logout.test.ts           # Testes de autenticação
│   ├── 📄 moderation.test.ts            # Testes de moderação
│   │
│   └── _core/                           # Core do backend
│       ├── 📄 context.ts                 # Contexto tRPC
│       ├── 📄 cookies.ts                 # Gerenciamento de cookies
│       ├── 📄 dataApi.ts                 # API de dados
│       ├── 📄 env.ts                     # Variáveis de ambiente
│       ├── 📄 imageGeneration.ts         # Geração de imagens (IA)
│       ├── 📄 index.ts                   # Export core
│       ├── 📄 llm.ts                     # Integração LLM
│       ├── 📄 map.ts                     # Funcionalidades de mapa
│       ├── 📄 notification.ts            # Sistema de notificações
│       ├── 📄 oauth.ts                   # OAuth (GitHub)
│       ├── 📄 sdk.ts                     # SDK customizado
│       ├── 📄 systemRouter.ts            # Router do sistema
│       ├── 📄 trpc.ts                    # Configuração tRPC
│       ├── 📄 vite.ts                    # Integração Vite
│       ├── 📄 voiceTranscription.ts      # Transcrição de voz
│       └── types/                       # Tipos TypeScript
│           ├── 📄 cookie.d.ts
│           └── 📄 manusTypes.ts
│
├── 📁 shared/                            # Código compartilhado (client/server)
│   ├── 📄 const.ts                       # Constantes compartilhadas
│   ├── 📄 types.ts                       # Tipos compartilhados
│   └── _core/
│       └── 📄 errors.ts                  # Tratamento de erros
│
├── 📁 drizzle/                           # Drizzle ORM (Banco de Dados)
│   ├── 📄 schema.ts                      # Schema do banco
│   ├── 📄 relations.ts                   # Relações entre tabelas
│   ├── 📄 0000_optimal_namora.sql       # Migration inicial
│   ├── 📄 0001_acoustic_the_hand.sql    # Migration 2
│   ├── meta/                            # Metadata das migrations
│   │   ├── 📄 0000_snapshot.json
│   │   ├── 📄 0001_snapshot.json
│   │   └── 📄 _journal.json
│   └── migrations/                      # Pasta de migrations
│       └── .gitkeep
│
├── 📁 patches/                           # Patches de dependências
│   └── 📄 wouter@3.7.1.patch
│
└── 📁 clubedofoco_updates/              # Backups/updates temporários
    ├── 📄 todo.md
    ├── client/
    │   └── [arquivos de backup...]
    └── server/
        └── [arquivos de backup...]
```

---

## 📊 Estatísticas do Projeto

### Totais Gerais
| Categoria | Quantidade |
|-----------|------------|
| **Total de Arquivos** | 150+ |
| **Linhas de Código** | ~25,000+ |
| **Pastas Principais** | 15+ |
| **Páginas HTML** | 25+ |
| **Componentes React** | 70+ |
| **Arquivos TypeScript** | 80+ |
| **Arquivos de Teste** | 5+ |

### Por Tecnologia
| Tecnologia | Arquivos |
|------------|----------|
| **TypeScript/TSX** | 80+ |
| **HTML** | 25+ |
| **CSS** | 10+ |
| **JavaScript** | 15+ |
| **JSON** | 10+ |
| **SQL (Migrations)** | 2+ |
| **Markdown** | 8+ |

---

## 🏗️ Arquitetura do Projeto

### **Dual Architecture (Híbrida)**

```
┌─────────────────────────────────────────────────────────┐
│                 CLUBE DO FOCO                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │  SITE ESTÁTICO   │        │   APP REACT      │     │
│  │  (HTML/CSS/JS)   │        │  (TypeScript)    │     │
│  ├──────────────────┤        ├──────────────────┤     │
│  │ • index.html     │        │ • client/        │     │
│  │ • docs/          │        │ • Dashboard      │     │
│  │ • upload/        │        │ • Upload UI      │     │
│  │ • admin/         │        │ • Moderation     │     │
│  └──────────────────┘        └──────────────────┘     │
│           │                          │                  │
│           └──────────┬───────────────┘                 │
│                      │                                  │
│              ┌───────▼────────┐                        │
│              │   BACKEND      │                        │
│              │   (Node.js)    │                        │
│              ├────────────────┤                        │
│              │ • tRPC API     │                        │
│              │ • Drizzle ORM  │                        │
│              │ • Auth OAuth   │                        │
│              │ • Storage      │                        │
│              └────────────────┘                        │
│                      │                                  │
│              ┌───────▼────────┐                        │
│              │   DATABASE     │                        │
│              │   (SQLite)     │                        │
│              └────────────────┘                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Descrição das Camadas

### 📁 **Site Estático (HTML Legado)**
Galeria original e páginas de documentação:
- **index.html** - Galeria principal (ainda em uso)
- **docs/** - Documentação educacional completa
- **upload/** - Sistema de upload em HTML puro
- **admin/** - Painel de moderação em HTML
- Usado para: SEO, landing pages, documentação pública

### 📁 **Client (React App)**
Aplicação moderna com TypeScript:
- **Framework:** React 18 + TypeScript
- **Roteamento:** Wouter
- **UI:** shadcn/ui (60+ componentes)
- **Styling:** Tailwind CSS
- **Build:** Vite
- **Funcionalidades:** 
  - Dashboard interativo
  - Upload com preview
  - Sistema de moderação avançado
  - Perfis de usuário
  - Tema claro/escuro

### 📁 **Server (Backend)**
API moderna com tRPC:
- **Framework:** Node.js + Express
- **API:** tRPC (type-safe)
- **ORM:** Drizzle
- **Database:** SQLite (desenvolvimento)
- **Auth:** OAuth (GitHub)
- **Funcionalidades:**
  - Upload de arquivos
  - Moderação de conteúdo
  - Gerenciamento de usuários
  - Sistema de notificações
  - Integração com IAs (LLM, image gen)

### 📁 **Shared**
Código compartilhado entre client e server:
- Tipos TypeScript
- Constantes
- Utilitários comuns
- Tratamento de erros

---

## 🔄 Fluxo de Dados

### Upload de Trabalho (React)
```
Client (Upload.tsx)
    ↓
tRPC API (routers-uploads.ts)
    ↓
Server (db-uploads.ts)
    ↓
Database (Drizzle ORM)
    ↓
Storage (sistema de arquivos)
    ↓
Retorna para Client
```

### Moderação
```
Admin acessa Moderation.tsx
    ↓
Lista trabalhos via tRPC
    ↓
Aprova/Rejeita
    ↓
Atualiza no banco
    ↓
Atualiza trabalhos.json
    ↓
Reflete na galeria
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI library
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes
- **tRPC Client** - API calls
- **Wouter** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime
- **Express** - Server
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database
- **Zod** - Validação
- **SQLite** - Database (dev)

### DevOps
- **GitHub Actions** - CI/CD
- **Cloudflare Pages** - Hosting
- **Vitest** - Testing
- **pnpm** - Package manager

### IAs Integradas
- **Manus IA** - Automação
- **LLM Integration** - Chat/assistente
- **Image Generation** - Criação de imagens
- **Voice Transcription** - Transcrição de áudio

---

## 📝 Arquivos de Configuração

| Arquivo | Propósito |
|---------|-----------|
| **package.json** | Dependências e scripts npm |
| **pnpm-lock.yaml** | Lock de dependências |
| **tsconfig.json** | Configuração TypeScript |
| **vite.config.ts** | Configuração Vite |
| **vitest.config.ts** | Configuração de testes |
| **drizzle.config.ts** | Configuração banco de dados |
| **components.json** | Configuração shadcn/ui |
| **.gitignore** | Arquivos ignorados |
| **.env.example** | Exemplo de variáveis |
| **CNAME** | Domínio customizado |

---

## 🎨 Convenções do Código

### Nomenclatura de Arquivos
- **React Components:** PascalCase (Dashboard.tsx)
- **Hooks:** camelCase com prefixo use (useAuth.ts)
- **Utilitários:** camelCase (utils.ts)
- **Tipos:** PascalCase (types.ts)
- **Constantes:** UPPER_CASE ou camelCase (const.ts)

### Estrutura de Pastas
- **Páginas:** `pages/NomeDaPagina.tsx`
- **Componentes:** `components/NomeDoComponente.tsx`
- **Hooks:** `hooks/useNomeDoHook.ts`
- **Utilitários:** `lib/nomeDoArquivo.ts`
- **Core:** `_core/` (arquivos do sistema base)

---

## 🔗 Links e Referências

### Documentação Técnica
- **tRPC:** [trpc.io](https://trpc.io)
- **Drizzle ORM:** [orm.drizzle.team](https://orm.drizzle.team)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)
- **Vite:** [vitejs.dev](https://vitejs.dev)

### Projeto
- **Repositório:** [github.com/Silviosb88/ia_para_negocios](https://github.com/Silviosb88/ia_para_negocios)
- **Site:** [clubedofoco.ia.br](https://clubedofoco.ia.br)
- **Documentação:** [clubedofoco.ia.br/docs/](https://clubedofoco.ia.br/docs/)

---

## ✨ Novos Arquivos (v2.1.1)

Os seguintes arquivos serão adicionados na versão 2.1.1:

```
✨ CONTRIBUTORS.md             # Lista de IAs e contribuidores
✨ CHANGELOG.md                # Histórico detalhado de versões
✨ GUIA-USO-OTIMIZADO-IAs.md  # Roteiro de uso de IAs gratuitas
✨ manifesto-ia-colaboracao.html # Manifesto de colaboração multi-IA
✨ ESTRUTURA.md                # Este arquivo
```

**Objetivo:** Documentar de forma transparente a colaboração entre humanos e múltiplas IAs no desenvolvimento do projeto.

---

## 📅 Histórico de Versões

| Data | Versão | Mudanças Principais |
|------|--------|---------------------|
| **19/02/2026** | **v2.1.1** | Adiciona documentação colaborativa multi-IA |
| 13/02/2026 | v2.1.0 | Sistema React completo com tRPC e Drizzle |
| 13/02/2026 | v2.0.0 | Migração para TypeScript e arquitetura moderna |
| 15/01/2026 | v1.0.0 | Versão inicial com HTML estático |

---

## 🎓 Para Novos Colaboradores

### Onboarding Rápido

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Silviosb88/ia_para_negocios.git
   cd ia_para_negocios
   ```

2. **Instale dependências**
   ```bash
   pnpm install
   ```

3. **Configure ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

4. **Rode em desenvolvimento**
   ```bash
   pnpm dev
   ```

5. **Leia a documentação**
   - QUICK_START.md - Início rápido
   - docs/INSTALLATION.md - Instalação detalhada
   - docs/TESTING.md - Como rodar testes

---

**Mantido por:** Clube do Foco - MBA IA para Negócios  
**Arquitetura:** Híbrida (HTML Estático + React SPA)  
**Colaboração:** Humanos + 6 IAs diferentes  
**Última Atualização:** 19 de Fevereiro de 2026
