# 📦 Guia de Instalação - Sistema de Upload

Instruções passo a passo para configurar o sistema de upload do Clube do Foco.

## ✅ Pré-requisitos

- Git instalado
- Conta GitHub
- Acesso ao repositório `ia_para_negocios`
- Conhecimento básico de Git e GitHub

## 🚀 Passo 1: Clonar Repositório

```bash
# Clone o repositório
git clone https://github.com/Silviosb88/ia_para_negocios.git

# Entre no diretório
cd ia_para_negocios
```

## 📂 Passo 2: Criar Estrutura de Pastas

```bash
# Criar diretórios necessários
mkdir -p upload/css upload/js
mkdir -p admin/css admin/js
mkdir -p data/uploads
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p docs
```

## 📋 Passo 3: Copiar Arquivos

Copie os seguintes arquivos para o repositório:

### Upload
```
upload/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── app.js
```

### Admin
```
admin/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── app.js
```

### GitHub
```
.github/
├── workflows/
│   └── validate-uploads.yml
├── CODEOWNERS
└── ISSUE_TEMPLATE/
    └── upload-moderation.md
```

### Documentação
```
docs/
├── SETUP.md
├── BRANCH_PROTECTION.md
├── CREDENCIAIS_SETUP.md
├── INSTALLATION.md
└── API.md
```

## 🌿 Passo 4: Criar Branches

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch upload
git checkout -b upload
git push origin upload

# Criar branch admin
git checkout -b admin
git push origin admin

# Voltar para main
git checkout main
```

## 🔐 Passo 5: Configurar Proteção de Branches

### Via GitHub Web Interface

1. Vá para: `Settings → Branches`
2. Clique em "Add rule"
3. Para branch `main`:
   - Branch name pattern: `main`
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ❌ Allow force pushes

4. Repita para branches `upload` e `admin`

Veja [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md) para detalhes completos.

## 🔑 Passo 6: Configurar GitHub OAuth

### Criar OAuth App

1. Vá para: `https://github.com/settings/developers`
2. Clique em "New OAuth App"
3. Preencha:
   - **Application name:** `Clube do Foco Upload`
   - **Homepage URL:** `https://clubedofoco.ia.br`
   - **Authorization callback URL:** `https://clubedofoco.ia.br/admin/callback`
4. Clique em "Register application"
5. Copie:
   - `Client ID`
   - `Client Secret`

### Gerar Personal Access Token

1. Vá para: `https://github.com/settings/tokens`
2. Clique em "Generate new token"
3. Selecione escopos:
   - ✅ `repo` (acesso completo)
   - ✅ `workflow` (GitHub Actions)
   - ✅ `admin:repo_hook` (webhooks)
4. Clique em "Generate token"
5. Copie o token (não será mostrado novamente)

## 📝 Passo 7: Configurar Arquivo .env

Crie arquivo `.env.local` na raiz do repositório:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=seu_client_id_aqui
GITHUB_CLIENT_SECRET=seu_client_secret_aqui
GITHUB_OAUTH_TOKEN=seu_token_aqui
GITHUB_REPO_OWNER=Silviosb88
GITHUB_REPO_NAME=ia_para_negocios

# JWT Secret (gere uma string aleatória)
JWT_SECRET=sua_string_aleatoria_aqui
JWT_EXPIRATION=7d
```

### Gerar JWT_SECRET

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object {Get-Random -Maximum 256}))

# Node.js (qualquer sistema)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ✅ Passo 8: Validar Instalação

### Verificar Estrutura

```bash
# Verificar se todos os arquivos existem
ls -la upload/
ls -la admin/
ls -la .github/workflows/
ls -la docs/
```

### Testar Páginas Localmente

```bash
# Se tiver Python 3
python -m http.server 8000

# Se tiver Node.js
npx http-server

# Acesse: http://localhost:8000/upload/
```

### Verificar GitHub Actions

1. Vá para: `https://github.com/Silviosb88/ia_para_negocios/actions`
2. Verifique se workflow `validate-uploads` aparece
3. Verifique se status checks estão ativas

## 🔄 Passo 9: Testar Fluxo Completo

### Teste 1: Criar Upload

```bash
# Criar branch de teste
git checkout -b test/primeiro-upload

# Criar arquivo JSON de teste
mkdir -p data/uploads
cat > data/uploads/UPL-TEST-001.json << 'EOF'
{
  "id": "UPL-TEST-001",
  "title": "Teste de Upload",
  "author": "Seu Nome",
  "type": "imagem",
  "description": "Este é um teste do sistema de upload",
  "tools": ["DALL-E"],
  "source": "Teste",
  "status": "pending",
  "date": "2026-02-14",
  "file": "test.jpg"
}
EOF

# Commit e push
git add data/uploads/UPL-TEST-001.json
git commit -m "test: primeiro upload de teste"
git push origin test/primeiro-upload
```

### Teste 2: Criar Pull Request

1. Vá para: `https://github.com/Silviosb88/ia_para_negocios`
2. Clique em "Compare & pull request"
3. Verifique se GitHub Actions rodou
4. Verifique se validação passou
5. Feche o PR (é apenas um teste)

### Teste 3: Verificar Proteção

```bash
# Tentar fazer push direto para main (deve falhar)
git checkout main
git push origin main  # Deve falhar se proteção está ativa
```

## 🎉 Passo 10: Publicar em Produção

### Fazer Deploy

```bash
# Atualizar main com uploads aprovados
git checkout main
git pull origin main

# Fazer merge de upload
git merge upload

# Push para produção
git push origin main
```

### Verificar Deploy

1. Acesse: `https://clubedofoco.ia.br/upload/`
2. Verifique se página carrega
3. Acesse: `https://clubedofoco.ia.br/admin/`
4. Verifique se painel carrega
5. Teste funcionalidades básicas

## 📋 Checklist de Instalação

- [ ] Repositório clonado
- [ ] Estrutura de pastas criada
- [ ] Arquivos copiados
- [ ] Branches criados (`upload`, `admin`)
- [ ] Proteção de branches configurada
- [ ] GitHub OAuth criado
- [ ] Personal Access Token gerado
- [ ] Arquivo `.env.local` criado
- [ ] GitHub Actions configurado
- [ ] Testes executados com sucesso
- [ ] Deploy em produção

## 🆘 Troubleshooting

### Erro: "Branch protection rule not found"

**Solução:**
- Verifique se você tem permissões de admin
- Verifique se branch existe
- Tente novamente em alguns minutos

### Erro: "OAuth callback URL mismatch"

**Solução:**
- Verifique URL exata em GitHub Settings
- Deve ser: `https://clubedofoco.ia.br/admin/callback`
- Sem barra final

### Erro: "GitHub Actions not running"

**Solução:**
- Verifique se `.github/workflows/validate-uploads.yml` existe
- Verifique se arquivo está bem formatado (YAML)
- Verifique se tem permissão para ativar Actions
- Vá para: `Settings → Actions → General` e ative

### Erro: "Permission denied" ao fazer push

**Solução:**
- Verifique se tem acesso ao repositório
- Verifique se SSH key está configurada
- Tente: `git config user.email "seu@email.com"`

## 📞 Próximos Passos

1. Leia [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md)
2. Leia [CREDENCIAIS_SETUP.md](CREDENCIAIS_SETUP.md)
3. Leia [API.md](API.md)
4. Comece a usar o sistema!

## 📚 Referências

- [GitHub Docs](https://docs.github.com)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Git Documentation](https://git-scm.com/doc)

---

**Versão:** 2.1  
**Última atualização:** Fevereiro de 2026
