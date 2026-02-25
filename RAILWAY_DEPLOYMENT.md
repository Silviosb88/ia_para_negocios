# 🚀 Guia de Deploy no Railway

**Projeto:** Clube do Foco v2 - MBA IA para Negócios  
**Plataforma:** Railway.app  
**Data:** 25 de Fevereiro de 2026

---

## 📋 Pré-requisitos

- ✅ Conta no Railway.app (https://railway.app)
- ✅ Repositório GitHub conectado
- ✅ Credenciais AWS S3 (salvas com segurança)
- ✅ Node.js 18+ (local, para testes)

---

## 🎯 Passo 1: Criar Novo Projeto no Railway

### 1.1 Acessar Railway
1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub"**

### 1.2 Conectar Repositório GitHub
1. Selecione o repositório: `ia_para_negocios`
2. Escolha a branch: `main`
3. Clique em **"Deploy"**

Railway vai:
- ✅ Clonar o repositório
- ✅ Detectar `package.json`
- ✅ Instalar dependências
- ✅ Executar build
- ✅ Iniciar servidor

---

## 🔧 Passo 2: Configurar Variáveis de Ambiente

### 2.1 Acessar Variáveis
1. No dashboard do Railway, clique no seu serviço
2. Vá para a aba **"Variables"**
3. Clique em **"+ New Variable"**

### 2.2 Adicionar Variáveis AWS

⚠️ **IMPORTANTE:** Nunca commit credenciais no GitHub!  
Use apenas Railway Variables (seguro).

**Variável 1: AWS_ACCESS_KEY_ID**
```
Variable Name: AWS_ACCESS_KEY_ID
Value: [Cole aqui sua chave AWS - AKIAZ...]
```

**Variável 2: AWS_SECRET_ACCESS_KEY**
```
Variable Name: AWS_SECRET_ACCESS_KEY
Value: [Cole aqui sua chave secreta AWS]
```

**Variável 3: AWS_S3_BUCKET**
```
Variable Name: AWS_S3_BUCKET
Value: clubedofoco-ia-arquivos
```

**Variável 4: AWS_REGION**
```
Variable Name: AWS_REGION
Value: us-east-1
```

### 2.3 Adicionar Variáveis de Aplicação

**Variável 5: NODE_ENV**
```
Variable Name: NODE_ENV
Value: production
```

**Variável 6: PORT**
```
Variable Name: PORT
Value: 3000
```

**Variável 7: VITE_BACKEND_URL** (para frontend)
```
Variable Name: VITE_BACKEND_URL
Value: https://[seu-projeto].railway.app
```

---

## 🗄️ Passo 3: Configurar Banco de Dados MySQL

### 3.1 Criar Banco de Dados
1. No dashboard do Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Clique em **"Add MySQL"**

Railway vai:
- ✅ Provisionar MySQL automaticamente
- ✅ Gerar `DATABASE_URL` automaticamente
- ✅ Adicionar à variável de ambiente

### 3.2 Verificar DATABASE_URL
1. Vá para a aba **"Variables"**
2. Procure por `DATABASE_URL`
3. Deve estar algo como:
```
mysql://user:password@host:port/database
```

---

## ✅ Passo 4: Verificar Deploy

### 4.1 Logs de Deploy
1. Clique na aba **"Deployments"**
2. Veja o status do deploy
3. Procure por mensagens de sucesso

### 4.2 Acessar Aplicação
1. Clique em **"Domains"**
2. Copie a URL gerada (ex: `https://ia-para-negocios-production.up.railway.app`)
3. Acesse no navegador

### 4.3 Testar Endpoints
```bash
# Verificar se servidor está rodando
curl https://[seu-projeto].railway.app/health

# Testar API tRPC
curl https://[seu-projeto].railway.app/api/trpc/auth.me
```

---

## 🔗 Passo 5: Conectar Frontend ao Backend

### 5.1 Atualizar `js/config.js`
No arquivo `js/config.js`, use variáveis de ambiente:

```javascript
const CONFIG = {
  // Backend API - Usa VITE_BACKEND_URL do Railway
  API_BASE_URL: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
  API_TRPC_URL: process.env.VITE_BACKEND_URL ? 
    `${process.env.VITE_BACKEND_URL}/api/trpc` : 
    'http://localhost:3000/api/trpc',
  
  // ... resto da configuração
};
```

### 5.2 Fazer Commit
```bash
git add js/config.js
git commit -m "Atualizar URL do backend para Railway"
git push origin main
```

GitHub Pages vai:
- ✅ Detectar mudança
- ✅ Redeployar automaticamente
- ✅ Frontend agora conectado ao backend

---

## 🧪 Passo 6: Testar Fluxo Completo

### 6.1 Teste de Autenticação
```
1. Acesse https://clubedofoco.ia.br
2. Clique em "🔐 Login com GitHub"
3. Autorize a aplicação
4. Você deve ser redirecionado para /upload/
```

### 6.2 Teste de Upload
```
1. Acesse https://clubedofoco.ia.br/upload/
2. Preencha o formulário
3. Selecione um arquivo (imagem, vídeo ou avatar)
4. Clique em "Enviar"
5. Arquivo deve ser enviado ao S3
```

### 6.3 Teste de Moderação
```
1. Acesse https://clubedofoco.ia.br/admin/ (com conta admin)
2. Veja trabalhos pendentes
3. Aprove ou rejeite
4. Trabalho aprovado aparece na galeria
```

### 6.4 Teste de Galeria
```
1. Acesse https://clubedofoco.ia.br
2. Veja trabalhos aprovados
3. Filtre por tipo (imagem, vídeo, avatar)
4. Busque por nome
5. Clique para ver detalhes
```

---

## 🔄 Passo 7: CI/CD Automático

### 7.1 Como Funciona
```
Você faz push no GitHub
    ↓
GitHub Actions detecta mudança
    ↓
Testa código (npm test)
    ↓
Se OK: Railway faz deploy automático
    ↓
Novo código está no ar em ~2 minutos
```

### 7.2 Configurar GitHub Actions

Crie arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npm run build
```

---

## 🐛 Troubleshooting

### Problema: Deploy falha com erro de dependências
**Solução:**
```bash
# Local
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "Atualizar dependências"
git push origin main
```

### Problema: Variáveis de ambiente não aparecem
**Solução:**
1. Verifique se foram salvas corretamente
2. Clique em "Redeploy" no Railway
3. Aguarde ~2 minutos

### Problema: Banco de dados não conecta
**Solução:**
1. Verifique `DATABASE_URL` em Variables
2. Teste conexão local:
```bash
mysql -h [host] -u [user] -p [password] -D [database]
```

### Problema: Upload não funciona
**Solução:**
1. Verifique credenciais AWS em Variables
2. Teste presigned URL
3. Verifique CORS configuration no S3

---

## 📊 Monitoramento

### Logs
1. No Railway, vá para **"Logs"**
2. Veja logs em tempo real
3. Procure por erros

### Métricas
1. Vá para **"Metrics"**
2. Veja CPU, memória, requisições
3. Configure alertas se necessário

---

## 🔐 Segurança

### Boas Práticas
- ✅ Nunca commit `.env` no GitHub
- ✅ Use Variables do Railway para secrets
- ✅ Rotacione credenciais AWS regularmente
- ✅ Monitore logs para atividades suspeitas
- ✅ Use HTTPS para todas as comunicações

### Backup do Banco de Dados
```bash
# Exportar banco de dados
mysqldump -h [host] -u [user] -p [database] > backup.sql

# Importar backup
mysql -h [host] -u [user] -p [database] < backup.sql
```

---

## 📈 Escalabilidade

### Se o site ficar lento:
1. Aumente recursos no Railway (CPU/RAM)
2. Ative cache com Cloudflare
3. Otimize queries do banco de dados
4. Use CDN para arquivos estáticos

### Se tiver muitos uploads:
1. Configure limite de tamanho
2. Implemente fila de processamento
3. Use S3 Transfer Acceleration
4. Considere usar Lambda para processamento

---

## 📞 Suporte

- **Railway Docs:** https://docs.railway.app
- **AWS S3 Docs:** https://docs.aws.amazon.com/s3
- **Node.js Docs:** https://nodejs.org/docs
- **GitHub Actions:** https://docs.github.com/actions

---

**Documento gerado em:** 25 de Fevereiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Pronto para Deploy

---

*Siga este guia passo a passo para fazer deploy do Clube do Foco v2 no Railway com sucesso!*
