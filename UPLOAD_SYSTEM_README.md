# 🚀 Sistema de Upload - Clube do Foco

Este repositório agora inclui o **Sistema de Upload** completo para gerenciar trabalhos de IA dos alunos.

## 📂 Estrutura Adicionada

```
clubedofoco_v2/
├── upload/                    # Página de upload
│   ├── index.html            # Página principal de upload
│   ├── css/styles.css        # Estilos
│   └── js/app.js             # Lógica de upload
├── admin/                     # Painel de moderação
│   ├── index.html            # Painel de admin
│   ├── css/styles.css        # Estilos
│   └── js/app.js             # Lógica de moderação
├── .github/
│   ├── workflows/
│   │   └── validate-uploads.yml  # GitHub Actions
│   └── CODEOWNERS            # Responsabilidades
└── upload-docs/              # Documentação
    ├── INSTALLATION.md
    ├── TESTING.md
    └── BRANCH_PROTECTION.md
```

## 🌐 Acessar as Páginas

### Upload Page
```
http://localhost:5173/upload/
```

### Admin Panel
```
http://localhost:5173/admin/
```

## 🚀 Como Rodar Localmente

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Rodar Dev Server
```bash
pnpm dev
```

### 3. Acessar no Navegador
- Upload: http://localhost:5173/upload/
- Admin: http://localhost:5173/admin/

## 📚 Documentação

Veja os arquivos em `upload-docs/`:
- **INSTALLATION.md** - Setup completo
- **TESTING.md** - Guia de testes
- **BRANCH_PROTECTION.md** - Proteção de branches

## ✨ Funcionalidades

### Upload Page
- ✅ Formulário completo com validação
- ✅ Drag-and-drop de arquivo
- ✅ Preview em tempo real
- ✅ Seleção de ferramentas de IA
- ✅ Responsivo e acessível

### Admin Panel
- ✅ Dashboard com estatísticas
- ✅ Filtros avançados
- ✅ Modal com preview
- ✅ Aprovação/rejeição
- ✅ Autenticação GitHub OAuth

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_GITHUB_CLIENT_ID=seu_client_id
VITE_GITHUB_CLIENT_SECRET=seu_client_secret
VITE_GITHUB_OAUTH_TOKEN=seu_oauth_token
VITE_JWT_SECRET=sua_string_aleatoria
```

## 📝 Próximos Passos

1. Revisar as páginas em desenvolvimento
2. Testar funcionalidades
3. Configurar GitHub OAuth
4. Deploy em produção

## 🎯 Status

- ✅ Upload Page: Completa
- ✅ Admin Panel: Completa
- ✅ GitHub Actions: Configurado
- ✅ Documentação: Completa
- ⏳ Deploy: Pronto para produção

## 📞 Suporte

Consulte a documentação em `upload-docs/` para mais detalhes.

---

**Desenvolvido por:** Manus IA  
**Data:** Fevereiro de 2026  
**Versão:** 2.1
