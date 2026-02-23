# Proteção de Branches - Clube do Foco

## Configuração Recomendada

Para proteger seu repositório contra conflitos com o Cloudflare e garantir qualidade do código, configure as seguintes proteções de branch:

### 1. Branch `main` (Galeria)

**Objetivo:** Proteger a galeria principal que é sincronizada com Cloudflare

**Configurações:**

```
Settings → Branches → Add rule
```

- **Branch name pattern:** `main`
- ✅ Require a pull request before merging
  - ✅ Require approvals (1)
  - ✅ Require review from Code Owners
  - ✅ Require status checks to pass
    - ✅ validate-uploads
    - ✅ sync-gallery
- ✅ Require branches to be up to date before merging
- ✅ Require status checks to pass before merging
- ✅ Require conversation resolution before merging
- ✅ Require code reviews before merging
- ❌ Allow force pushes
- ❌ Allow deletions

### 2. Branch `upload` (Desenvolvimento)

**Objetivo:** Permitir desenvolvimento de novas funcionalidades sem afetar a galeria

**Configurações:**

```
Settings → Branches → Add rule
```

- **Branch name pattern:** `upload`
- ✅ Require a pull request before merging
  - ✅ Require approvals (1)
  - ✅ Require status checks to pass
    - ✅ validate-uploads
- ✅ Require branches to be up to date before merging
- ❌ Allow force pushes
- ❌ Allow deletions

### 3. Branch `admin` (Painel de Moderação)

**Objetivo:** Proteger o painel de moderação

**Configurações:**

```
Settings → Branches → Add rule
```

- **Branch name pattern:** `admin`
- ✅ Require a pull request before merging
  - ✅ Require approvals (1)
  - ✅ Require status checks to pass
    - ✅ validate-uploads
- ✅ Require branches to be up to date before merging
- ❌ Allow force pushes
- ❌ Allow deletions

## Fluxo de Trabalho Recomendado

### Para Adicionar Novo Upload

```bash
# 1. Criar branch
git checkout -b upload/novo-trabalho

# 2. Adicionar arquivo JSON
cp template.json data/uploads/UPL-XXXX.json
# Editar arquivo com informações do upload

# 3. Commit e push
git add data/uploads/UPL-XXXX.json
git commit -m "upload: adicionar novo trabalho - [Título]"
git push origin upload/novo-trabalho

# 4. Criar Pull Request
# GitHub Actions validará automaticamente
# Após aprovação, merge para main
```

### Para Modificar Painel de Moderação

```bash
# 1. Criar branch
git checkout -b admin/nova-funcionalidade

# 2. Fazer mudanças
# Editar arquivos em /admin/

# 3. Commit e push
git add admin/
git commit -m "admin: descrever mudança"
git push origin admin/nova-funcionalidade

# 4. Criar Pull Request
# Após testes e aprovação, merge
```

### Para Atualizar Galeria

```bash
# 1. Criar branch
git checkout -b galeria/atualizacao

# 2. Fazer mudanças
# Editar arquivos em /galeria/

# 3. Commit e push
git add galeria/
git commit -m "galeria: descrever mudança"
git push origin galeria/atualizacao

# 4. Criar Pull Request
# Requer aprovação de Code Owner
# Após merge, Cloudflare sincroniza automaticamente
```

## Sincronização com Cloudflare

### Quando Cloudflare Faz Commit

Se o Cloudflare fizer commit automático na branch `main`:

1. **Verificar conflito:**
   ```bash
   git fetch origin
   git status
   ```

2. **Se houver conflito:**
   ```bash
   # Não faça force push!
   # Ao invés, crie um PR para resolver
   git pull origin main
   # Resolver conflitos manualmente
   git add .
   git commit -m "Resolver conflito com Cloudflare"
   git push
   ```

3. **Criar PR para resolver:**
   - Vá para GitHub
   - Crie um Pull Request
   - Descreva os conflitos resolvidos
   - Aguarde aprovação

## Proteção Contra Problemas Comuns

### Problema: Conflito com Cloudflare

**Solução:**
- Branches separadas (`main` para galeria, `upload` para desenvolvimento)
- Sincronização automática via GitHub Actions
- Proteção de branch exige PR para merge

### Problema: Upload com JSON inválido

**Solução:**
- GitHub Actions valida JSON antes de merge
- Status check `validate-uploads` deve passar
- Sem merge se validação falhar

### Problema: Perda de dados

**Solução:**
- Sem force pushes permitidos
- Histórico completo de commits
- Backups automáticos via GitHub

### Problema: Moderação não sincroniza

**Solução:**
- GitHub Actions automático em cada push
- Arquivo `gallery.json` atualizado automaticamente
- Logs disponíveis em "Actions" tab

## Monitoramento

### Verificar Status

1. **GitHub Actions:**
   - Vá para: `Settings → Actions → General`
   - Verifique logs em: `Actions` tab

2. **Branch Protection:**
   - Vá para: `Settings → Branches`
   - Verifique regras ativas

3. **Cloudflare Sync:**
   - Verifique commits automáticos
   - Procure por commits de "Cloudflare"

## Troubleshooting

### Status Check Falhando

```bash
# 1. Verificar logs localmente
npm run validate

# 2. Se JSON inválido
node -e "JSON.parse(require('fs').readFileSync('seu-arquivo.json'))"

# 3. Se schema inválido
# Verificar arquivo contra template
```

### Merge Bloqueado

**Causas possíveis:**
- ❌ Status check falhando
- ❌ Requer aprovação
- ❌ Requer atualização com main
- ❌ Conflitos não resolvidos

**Soluções:**
- Resolver conflitos
- Solicitar aprovação
- Atualizar branch: `git pull origin main`
- Verificar status checks

## Referências

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions](https://docs.github.com/en/actions)
