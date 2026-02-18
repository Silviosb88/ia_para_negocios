# 🚀 Quick Start - Sistema de Upload

Instruções rápidas para começar com o sistema de upload.

## 📋 Pré-requisitos

- Git instalado
- Conta GitHub
- Acesso ao repositório `ia_para_negocios`

## ⚡ 5 Passos Rápidos

### 1️⃣ Clonar Repositório

```bash
git clone https://github.com/Silviosb88/ia_para_negocios.git
cd ia_para_negocios
```

### 2️⃣ Copiar Arquivos

```bash
# Copie todos os arquivos desta pasta para o repositório
# Mantenha a estrutura de pastas:
# - upload/
# - admin/
# - .github/
# - docs/
# - data/
```

### 3️⃣ Criar Branches

```bash
git checkout -b upload
git push origin upload

git checkout -b admin
git push origin admin

git checkout main
```

### 4️⃣ Configurar GitHub OAuth

1. Vá para: https://github.com/settings/developers
2. Clique em "New OAuth App"
3. Preencha:
   - **Application name:** Clube do Foco Upload
   - **Homepage URL:** https://clubedofoco.ia.br
   - **Authorization callback URL:** https://clubedofoco.ia.br/admin/callback
4. Copie `Client ID` e `Client Secret`

### 5️⃣ Configurar Proteção de Branches

1. Vá para: `Settings → Branches`
2. Clique em "Add rule"
3. Para branch `main`:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
4. Repita para `upload` e `admin`

## 🧪 Testar Localmente

```bash
# Abrir servidor local
python -m http.server 8000

# Acessar
# Upload: http://localhost:8000/upload/
# Admin: http://localhost:8000/admin/
```

## 📚 Documentação Completa

- **README.md** - Visão geral
- **INSTALLATION.md** - Setup passo a passo
- **TESTING.md** - Guia de testes
- **BRANCH_PROTECTION.md** - Proteção de branches

## 🎯 Próximos Passos

1. Leia **INSTALLATION.md** para setup completo
2. Leia **TESTING.md** para testar tudo
3. Faça deploy em produção
4. Treine moderadores

## 📞 Suporte

- Documentação: Veja arquivos em `docs/`
- Issues: GitHub Issues
- Email: contato@clubedofoco.ia.br

---

**Versão:** 2.1  
**Desenvolvido por:** Manus IA  
**Data:** Fevereiro de 2026
