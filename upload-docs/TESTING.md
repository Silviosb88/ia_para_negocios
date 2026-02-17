# 🧪 Guia de Testes - Sistema de Upload

Instruções completas para testar e validar o sistema de upload do Clube do Foco.

## 📋 Tipos de Testes

### 1. Testes Manuais (UI/UX)
### 2. Testes de Validação (JSON)
### 3. Testes de Integração (GitHub)
### 4. Testes de Segurança
### 5. Testes de Performance

---

## 🧪 1. Testes Manuais - Página de Upload

### Teste 1.1: Carregar Página

**Objetivo:** Verificar se página carrega corretamente

**Passos:**
1. Acesse: `https://clubedofoco.ia.br/upload/`
2. Verifique se todos os elementos aparecem:
   - ✅ Header com logo
   - ✅ Formulário completo
   - ✅ Dropzone
   - ✅ Info panel
   - ✅ Footer

**Resultado esperado:** Página carrega sem erros

### Teste 1.2: Drag-and-Drop

**Objetivo:** Testar funcionalidade de drag-and-drop

**Passos:**
1. Prepare um arquivo de teste (JPG, PNG, MP4, MP3)
2. Arraste arquivo para dropzone
3. Verifique preview do arquivo
4. Clique em "Remover"
5. Verifique se arquivo foi removido

**Resultado esperado:** Preview aparece e remove corretamente

### Teste 1.3: Validação de Arquivo

**Objetivo:** Testar validação de tipo e tamanho

**Passos:**
1. Tente enviar arquivo inválido (.exe, .zip)
2. Verifique mensagem de erro
3. Tente enviar arquivo > 100MB
4. Verifique mensagem de erro
5. Envie arquivo válido
6. Verifique se aceita

**Resultado esperado:** Erros apropriados para arquivos inválidos

### Teste 1.4: Preenchimento de Formulário

**Objetivo:** Testar validação de campos

**Passos:**
1. Deixe título vazio e tente enviar
2. Verifique erro
3. Preencha título (máx 100 caracteres)
4. Verifique contador de caracteres
5. Preencha descrição (máx 500 caracteres)
6. Verifique contador
7. Selecione tipo
8. Selecione ferramentas
9. Preencha autor
10. Aceite termos

**Resultado esperado:** Validação funciona corretamente

### Teste 1.5: Envio de Formulário

**Objetivo:** Testar envio completo

**Passos:**
1. Preencha todos os campos obrigatórios
2. Selecione arquivo
3. Clique em "Enviar Trabalho"
4. Aguarde mensagem de sucesso
5. Verifique se pode enviar outro

**Resultado esperado:** Mensagem de sucesso aparece

### Teste 1.6: Responsividade

**Objetivo:** Testar em diferentes tamanhos de tela

**Passos:**
1. Abra DevTools (F12)
2. Teste em:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
3. Verifique se layout se adapta
4. Verifique se botões funcionam
5. Verifique se texto é legível

**Resultado esperado:** Layout responsivo em todos os tamanhos

### Teste 1.7: Acessibilidade

**Objetivo:** Testar acessibilidade

**Passos:**
1. Navegue com Tab
2. Verifique focus rings visíveis
3. Teste com screen reader (NVDA, JAWS)
4. Verifique labels dos inputs
5. Verifique alt text das imagens

**Resultado esperado:** Navegação acessível com teclado

---

## 🧪 2. Testes Manuais - Painel de Moderação

### Teste 2.1: Carregar Painel

**Objetivo:** Verificar se painel carrega corretamente

**Passos:**
1. Acesse: `https://clubedofoco.ia.br/admin/`
2. Verifique se tela de login aparece
3. Clique em "Login com GitHub"
4. Verifique se redirecionamento funciona

**Resultado esperado:** Tela de login aparece

### Teste 2.2: Autenticação

**Objetivo:** Testar login com GitHub

**Passos:**
1. Clique em "Login com GitHub"
2. Faça login com suas credenciais
3. Autorize aplicação
4. Verifique se retorna ao painel
5. Verifique se nome do usuário aparece
6. Clique em "Sair"
7. Verifique se volta à tela de login

**Resultado esperado:** Autenticação funciona

### Teste 2.3: Dashboard

**Objetivo:** Testar estatísticas

**Passos:**
1. Faça login
2. Verifique cards de estatísticas:
   - Pendentes
   - Aprovados
   - Rejeitados
   - Total
3. Verifique se números são corretos

**Resultado esperado:** Estatísticas aparecem e estão corretas

### Teste 2.4: Filtros

**Objetivo:** Testar filtros

**Passos:**
1. Selecione filtro por status: "Pendentes"
2. Verifique se lista filtra
3. Selecione filtro por tipo: "Vídeo"
4. Verifique se lista filtra
5. Digite na busca: "avatar"
6. Verifique se lista filtra
7. Clique "Atualizar"
8. Verifique se lista recarrega

**Resultado esperado:** Filtros funcionam corretamente

### Teste 2.5: Modal de Detalhes

**Objetivo:** Testar modal

**Passos:**
1. Clique em um item da lista
2. Verifique se modal abre
3. Verifique se todos os detalhes aparecem:
   - Preview do arquivo
   - Título
   - Autor
   - Tipo
   - Data
   - Ferramentas
   - Descrição
   - Fonte (se houver)
4. Clique em "X" para fechar
5. Verifique se modal fecha

**Resultado esperado:** Modal funciona corretamente

### Teste 2.6: Aprovação/Rejeição

**Objetivo:** Testar ações de moderação

**Passos:**
1. Abra modal de um upload pendente
2. Clique em "Aprovar"
3. Verifique se status muda para "Aprovado"
4. Verifique se item sai da fila pendente
5. Abra outro modal
6. Clique em "Rejeitar"
7. Digite motivo
8. Verifique se status muda para "Rejeitado"

**Resultado esperado:** Ações funcionam corretamente

---

## ✅ 3. Testes de Validação JSON

### Teste 3.1: JSON Válido

**Arquivo de teste:** `test-valid.json`

```json
{
  "id": "UPL-TEST-001",
  "title": "Teste Válido",
  "author": "João Silva",
  "type": "imagem",
  "description": "Descrição de teste",
  "tools": ["DALL-E"],
  "source": "Teste",
  "status": "pending",
  "date": "2026-02-14",
  "file": "test.jpg"
}
```

**Teste:**
```bash
node -e "JSON.parse(require('fs').readFileSync('test-valid.json'))"
```

**Resultado esperado:** Sem erro

### Teste 3.2: JSON Inválido

**Arquivo de teste:** `test-invalid.json`

```json
{
  "id": "UPL-TEST-002",
  "title": "Teste Inválido"
  "author": "João Silva"  // Falta vírgula
}
```

**Teste:**
```bash
node -e "JSON.parse(require('fs').readFileSync('test-invalid.json'))"
```

**Resultado esperado:** Erro de sintaxe

### Teste 3.3: Campo Obrigatório Faltando

**Arquivo de teste:** `test-missing-field.json`

```json
{
  "id": "UPL-TEST-003",
  "title": "Teste Sem Campo",
  "author": "João Silva",
  // Falta "type"
  "description": "Descrição",
  "tools": ["DALL-E"],
  "status": "pending",
  "date": "2026-02-14"
}
```

**Teste:**
```bash
node -e "
const upload = JSON.parse(require('fs').readFileSync('test-missing-field.json'));
const required = ['id', 'title', 'author', 'type', 'description', 'tools', 'status', 'date'];
required.forEach(field => {
  if (!upload[field]) throw new Error('Campo faltando: ' + field);
});
"
```

**Resultado esperado:** Erro de campo faltando

### Teste 3.4: Tipo Inválido

**Arquivo de teste:** `test-invalid-type.json`

```json
{
  "id": "UPL-TEST-004",
  "title": "Teste Tipo Inválido",
  "author": "João Silva",
  "type": "documento",  // Inválido
  "description": "Descrição",
  "tools": ["DALL-E"],
  "status": "pending",
  "date": "2026-02-14"
}
```

**Teste:**
```bash
node -e "
const upload = JSON.parse(require('fs').readFileSync('test-invalid-type.json'));
const validTypes = ['imagem', 'video', 'avatar', 'audio', 'outro'];
if (!validTypes.includes(upload.type)) throw new Error('Tipo inválido: ' + upload.type);
"
```

**Resultado esperado:** Erro de tipo inválido

---

## 🔄 4. Testes de Integração GitHub

### Teste 4.1: GitHub Actions Executa

**Objetivo:** Verificar se workflow executa

**Passos:**
1. Vá para: `https://github.com/Silviosb88/ia_para_negocios/actions`
2. Verifique se workflow `validate-uploads` aparece
3. Clique em workflow
4. Verifique se rodou recentemente
5. Verifique status (sucesso ou falha)

**Resultado esperado:** Workflow aparece e executa

### Teste 4.2: Validação Automática

**Objetivo:** Testar validação automática

**Passos:**
1. Crie branch de teste: `git checkout -b test/validation`
2. Crie arquivo JSON inválido em `data/uploads/`
3. Commit e push
4. Vá para Actions
5. Verifique se workflow falhou
6. Verifique mensagem de erro
7. Corrija arquivo
8. Commit e push novamente
9. Verifique se workflow passou

**Resultado esperado:** Validação funciona

### Teste 4.3: Sincronização de Galeria

**Objetivo:** Testar sincronização automática

**Passos:**
1. Crie upload com status "approved"
2. Commit e push para main
3. Aguarde GitHub Actions
4. Verifique se `gallery.json` foi atualizado
5. Verifique se upload aparece em `gallery.json`

**Resultado esperado:** Galeria sincroniza automaticamente

### Teste 4.4: GitHub Issues Automático

**Objetivo:** Testar criação de issues

**Passos:**
1. Crie upload com status "pending"
2. Commit com mensagem contendo "upload:"
3. Push para main
4. Vá para Issues
5. Verifique se nova issue foi criada
6. Verifique se contém informações do upload

**Resultado esperado:** Issue criada automaticamente

---

## 🔒 5. Testes de Segurança

### Teste 5.1: Validação de Entrada

**Objetivo:** Testar proteção contra XSS

**Passos:**
1. Tente enviar título com script:
   ```
   <script>alert('XSS')</script>
   ```
2. Verifique se script não executa
3. Verifique se é escapado no JSON

**Resultado esperado:** Script é escapado

### Teste 5.2: Validação de Arquivo

**Objetivo:** Testar proteção contra upload malicioso

**Passos:**
1. Tente enviar arquivo .exe
2. Verifique se é rejeitado
3. Tente enviar arquivo > 100MB
4. Verifique se é rejeitado
5. Tente enviar arquivo com MIME type falso
6. Verifique se é validado

**Resultado esperado:** Arquivos maliciosos são rejeitados

### Teste 5.3: Autenticação

**Objetivo:** Testar proteção do painel

**Passos:**
1. Tente acessar painel sem login
2. Verifique se é redirecionado para login
3. Tente acessar com URL direta
4. Verifique se ainda exige login

**Resultado esperado:** Painel protegido

### Teste 5.4: Branch Protection

**Objetivo:** Testar proteção de branches

**Passos:**
1. Tente fazer push direto para main
2. Verifique se é bloqueado
3. Crie PR em vez de push direto
4. Verifique se PR requer aprovação
5. Verifique se requer status checks

**Resultado esperado:** Branch protegido

---

## ⚡ 6. Testes de Performance

### Teste 6.1: Tempo de Carregamento

**Objetivo:** Verificar performance da página

**Passos:**
1. Abra DevTools (F12)
2. Vá para Network
3. Recarregue página
4. Verifique tempo total de carregamento
5. Verifique tamanho dos arquivos

**Resultado esperado:** < 3 segundos

### Teste 6.2: Tamanho de Arquivo

**Objetivo:** Verificar tamanho dos assets

**Passos:**
```bash
# Verificar tamanho
ls -lh upload/css/styles.css
ls -lh upload/js/app.js
ls -lh admin/css/styles.css
ls -lh admin/js/app.js
```

**Resultado esperado:**
- CSS: < 50KB
- JS: < 30KB

### Teste 6.3: Renderização

**Objetivo:** Verificar performance de renderização

**Passos:**
1. Abra DevTools (F12)
2. Vá para Performance
3. Comece a gravar
4. Interaja com página
5. Pare de gravar
6. Analise FPS

**Resultado esperado:** > 60 FPS

---

## 📋 Checklist de Testes

### Testes Manuais
- [ ] Página de upload carrega
- [ ] Drag-and-drop funciona
- [ ] Validação de arquivo funciona
- [ ] Formulário valida campos
- [ ] Envio funciona
- [ ] Responsivo em mobile
- [ ] Responsivo em tablet
- [ ] Responsivo em desktop
- [ ] Acessível com teclado
- [ ] Painel carrega
- [ ] Login funciona
- [ ] Dashboard mostra stats
- [ ] Filtros funcionam
- [ ] Modal funciona
- [ ] Aprovação funciona
- [ ] Rejeição funciona

### Testes de Validação
- [ ] JSON válido aceito
- [ ] JSON inválido rejeitado
- [ ] Campo faltando rejeitado
- [ ] Tipo inválido rejeitado

### Testes de Integração
- [ ] GitHub Actions executa
- [ ] Validação automática funciona
- [ ] Galeria sincroniza
- [ ] Issues criadas automaticamente

### Testes de Segurança
- [ ] XSS prevenido
- [ ] Upload malicioso bloqueado
- [ ] Painel autenticado
- [ ] Branch protegido

### Testes de Performance
- [ ] Carregamento < 3s
- [ ] CSS < 50KB
- [ ] JS < 30KB
- [ ] FPS > 60

---

## 🚀 Executar Testes Automaticamente

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em watch mode
npm run test:watch
```

---

## 📊 Relatório de Testes

Após executar todos os testes, crie um relatório:

```
# Relatório de Testes - Sistema de Upload

## Data: 2026-02-14
## Testador: [Seu Nome]

### Resumo
- Total de testes: 50
- Passaram: 50
- Falharam: 0
- Taxa de sucesso: 100%

### Detalhes
[Listar testes que falharam, se houver]

### Observações
[Adicionar observações gerais]

### Assinado por
[Seu nome e data]
```

---

## 📞 Suporte

Se encontrar problemas durante os testes:

1. Verifique documentação
2. Crie GitHub Issue
3. Entre em contato: contato@clubedofoco.ia.br

---

**Versão:** 2.1  
**Última atualização:** Fevereiro de 2026
