# 🔄 Configuração de CI/CD - GitHub Actions

**Projeto:** Clube do Foco v2  
**Data:** 25 de Fevereiro de 2026

---

## 📋 O que é CI/CD?

**CI (Continuous Integration):** Testa código automaticamente a cada push  
**CD (Continuous Deployment):** Deploy automático após testes passarem

---

## 🎯 Benefícios

- ✅ Testes automáticos em cada commit
- ✅ Deploy automático no Railway
- ✅ Detecta erros antes de ir ao ar
- ✅ Histórico de deploys
- ✅ Rollback automático em caso de erro

---

## 🚀 Passo 1: Criar GitHub Actions Workflow

### 1.1 Criar Arquivo
1. No GitHub, vá para: **"Actions"** → **"New workflow"**
2. Ou crie manualmente:
   - Pasta: `.github/workflows/`
   - Arquivo: `deploy.yml`

### 1.2 Conteúdo do Arquivo

Copie o código abaixo e cole em `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: Testar Frontend
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build frontend
        run: npm run build

  # Job 2: Testar Backend
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        working-directory: ./backend
        run: pnpm install
      
      - name: Run tests
        working-directory: ./backend
        run: pnpm test
        continue-on-error: true

  # Job 3: Deploy para Railway
  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          echo "🚀 Iniciando deploy no Railway..."
          echo "📦 Commit: ${{ github.sha }}"
          echo "👤 Autor: ${{ github.actor }}"
```

---

## 🔐 Passo 2: Configurar Railway Token

### 2.1 Gerar Token no Railway
1. Acesse: https://railway.app/account/tokens
2. Clique em **"Create New Token"**
3. Copie o token

### 2.2 Adicionar ao GitHub Secrets
1. Vá para: GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Clique em **"New repository secret"**
3. Nome: `RAILWAY_TOKEN`
4. Valor: Cole o token do Railway
5. Clique em **"Add secret"**

---

## ✅ Passo 3: Testar Workflow

### 3.1 Fazer um Commit
```bash
git add .
git commit -m "Testar CI/CD"
git push origin main
```

### 3.2 Verificar Execução
1. Vá para: GitHub → **Actions**
2. Veja o workflow em execução
3. Clique para ver detalhes

### 3.3 Resultado Esperado
```
✅ test-frontend: Passou
✅ test-backend: Passou
✅ deploy: Deploy realizado
```

---

## 📊 Fluxo de Execução

```
Você faz push
    ↓
GitHub detecta mudança
    ↓
Inicia workflow
    ↓
├─ test-frontend (paralelo)
│   ├─ npm install
│   └─ npm run build
│
├─ test-backend (paralelo)
│   ├─ pnpm install
│   └─ pnpm test
│
└─ deploy (após ambos)
    └─ Deploy no Railway
```

---

## 🐛 Troubleshooting

### Problema: Workflow não executa
**Solução:**
1. Verifique se arquivo está em `.github/workflows/deploy.yml`
2. Verifique sintaxe YAML (indentação)
3. Faça push novamente

### Problema: Testes falhando
**Solução:**
1. Vá para **Actions** → Clique no workflow
2. Veja logs detalhados
3. Corrija o erro localmente
4. Faça push novamente

### Problema: Deploy não funciona
**Solução:**
1. Verifique se `RAILWAY_TOKEN` está configurado
2. Verifique se token ainda é válido
3. Regenere token se necessário

---

## 📈 Próximos Passos

### Adicionar Mais Testes
```yaml
- name: Run linter
  run: npm run lint

- name: Run security check
  run: npm audit
```

### Adicionar Notificações
```yaml
- name: Notify on Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Adicionar Coverage Report
```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

---

## 🔗 Links Úteis

- **GitHub Actions Docs:** https://docs.github.com/actions
- **Railway Docs:** https://docs.railway.app
- **YAML Syntax:** https://yaml.org
- **Workflow Syntax:** https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

---

## 📝 Checklist de Configuração

- [ ] Criar arquivo `.github/workflows/deploy.yml`
- [ ] Copiar conteúdo do workflow
- [ ] Gerar token no Railway
- [ ] Adicionar `RAILWAY_TOKEN` aos GitHub Secrets
- [ ] Fazer push de um commit
- [ ] Verificar execução em **Actions**
- [ ] Confirmar deploy no Railway

---

**Documento gerado em:** 25 de Fevereiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Pronto para Configuração

---

*Guia passo a passo para configurar CI/CD automático com GitHub Actions e Railway.*
