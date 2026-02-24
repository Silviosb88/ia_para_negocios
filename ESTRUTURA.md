# 📁 Estrutura do Projeto - Clube do Foco

## 🎯 Visão Geral

Este é um **monorepo** que contém frontend e backend em um único repositório.

```
ia_para_negocios/
├── 📄 index.html              (Página inicial - galeria pública)
├── 📄 perfil.html             (Página de perfil do usuário)
├── 📁 admin/                  (Painel de administração)
│   ├── index.html             (Dashboard admin)
│   ├── usuarios.html          (Gerenciar usuários)
│   └── uploads.html           (Gerenciar uploads)
├── 📁 js/                     (Scripts JavaScript)
│   ├── auth.js                (Autenticação OAuth)
│   ├── permissions.js         (Sistema de permissões)
│   ├── database.js            (Banco de dados localStorage)
│   └── app.js                 (Script principal)
├── 📁 css/                    (Estilos CSS)
├── 📁 docs/                   (Documentação)
├── 📁 data/                   (Dados estáticos)
│
├── 📁 backend/                (⭐ BACKEND - Express + tRPC)
│   ├── 📁 server/             (Código do servidor)
│   ├── 📁 client/             (Frontend React)
│   ├── 📁 drizzle/            (Banco de dados)
│   ├── package.json           (Dependências backend)
│   ├── vite.config.ts         (Configuração Vite)
│   └── tsconfig.json          (Configuração TypeScript)
│
└── 📄 package.json            (Dependências frontend)
```

---

## 🚀 Como Usar

### Frontend (Estático - GitHub Pages)
```bash
# Editar arquivos HTML/CSS/JS
# Fazer commit e push
# Automaticamente publicado em https://clubedofoco.ia.br
```

### Backend (Express + tRPC)
```bash
cd backend
pnpm install
pnpm dev
# Rodando em http://localhost:3000
```

---

## 📊 Componentes

| Componente | Localização | Tipo | Descrição |
|-----------|-----------|------|-----------|
| **Galeria** | `index.html` | Estático | Página inicial com galeria de trabalhos |
| **Perfil** | `perfil.html` | Estático | Página de perfil do usuário |
| **Admin** | `admin/` | Estático | Painel de administração |
| **Auth** | `js/auth.js` | JavaScript | Autenticação OAuth com GitHub |
| **Permissions** | `js/permissions.js` | JavaScript | Sistema de roles (user/admin) |
| **Database** | `js/database.js` | JavaScript | Armazenamento em localStorage |
| **Backend** | `backend/` | Express/tRPC | API e lógica de negócio |

---

## 🔐 Autenticação

- **Frontend:** OAuth com GitHub (localStorage)
- **Backend:** OAuth com GitHub (banco de dados)
- **Integração:** Ambos usam GitHub como provedor

---

## 📚 Documentação

- `CONTRIBUIDORES.md` - Lista de contribuidores
- `CHANGELOG.md` - Histórico de mudanças
- `docs/github-oauth-guia.md` - Guia de OAuth
- `backend/README.md` - Documentação do backend

---

## 🌿 Branches

Quando criar um branch, use:
```bash
git checkout -b feature/nome-da-feature
```

Exemplo:
```bash
git checkout -b feature/autenticacao-oauth
```

---

**Última atualização:** 24/02/2026
**Versão:** 2.0
