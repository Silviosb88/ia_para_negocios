# 🔐 Guia: Autenticação com GitHub OAuth

**Clube do Foco - MBA IA para Negócios**

---

## 📚 O que é OAuth?

OAuth é um protocolo de **autenticação e autorização** que permite que você use sua conta do GitHub para fazer login em outros sites e aplicações, sem precisar compartilhar sua senha.

**Analogia simples:**
- Sem OAuth: Você dá sua chave de casa para o entregador
- Com OAuth: Você abre a porta apenas para o entregador, sem dar a chave

---

## 🔄 Como Funciona o Fluxo OAuth

```
1. Você clica em "Login com GitHub"
   ↓
2. É redirecionado para github.com
   ↓
3. Você autoriza o Clube do Foco a acessar seus dados
   ↓
4. GitHub envia um código de autorização
   ↓
5. O Clube do Foco recebe o código
   ↓
6. Você está autenticado e pode usar a plataforma
```

---

## 🚀 Como Fazer Login

### Passo 1: Acessar o Site
Acesse **https://clubedofoco.ia.br**

### Passo 2: Clicar em "Login com GitHub"
Procure pelo botão no menu superior ou na página de login

### Passo 3: Autorizar
Você será redirecionado para GitHub. Clique em **"Authorize"** para permitir que o Clube do Foco acesse seus dados básicos

### Passo 4: Pronto!
Você será redirecionado de volta ao site, agora autenticado

---

## 🛡️ Segurança: O que o Clube do Foco Pode Acessar?

Quando você faz login com GitHub, o Clube do Foco solicita permissão para acessar:

| Informação | O que é | Por quê |
|---|---|---|
| **Nome de usuário** | Seu username no GitHub | Para exibir no perfil |
| **Email** | Seu email público | Para notificações |
| **Avatar** | Sua foto de perfil | Para exibir no perfil |
| **Perfil público** | Informações públicas | Para validação |

**O que o Clube do Foco NÃO pode acessar:**
- ❌ Seus repositórios privados
- ❌ Seus tokens de acesso
- ❌ Seus dados de pagamento
- ❌ Suas configurações de segurança

---

## 💾 Onde Seus Dados São Armazenados?

Seus dados são armazenados **localmente no seu navegador** em `localStorage`:

```javascript
{
  "login": "seu-username",
  "id": 12345,
  "avatar_url": "https://avatars.githubusercontent.com/...",
  "html_url": "https://github.com/seu-username"
}
```

**Segurança:**
- ✅ Dados armazenados apenas no seu computador
- ✅ Nenhum servidor armazena sua senha
- ✅ Você pode deletar a qualquer momento limpando o cache

---

## 🔗 Integração com Outras Funcionalidades do GitHub

Após fazer login com GitHub, você terá acesso a:

### 1. **GitHub Copilot** (Gratuito para Estudantes)
- Autocomplete de código inteligente
- Sugestões baseadas em IA
- Disponível em VS Code, JetBrains, Vim

**Como ativar:**
1. Acesse https://github.com/settings/copilot
2. Ative "GitHub Copilot for Individuals"
3. Instale a extensão no seu editor

### 2. **GitHub Codespaces** (Gratuito para Estudantes)
- Ambiente de desenvolvimento na nuvem
- Sem precisar instalar nada localmente
- Acesso via navegador

**Como usar:**
1. Abra um repositório no GitHub
2. Clique em "Code" → "Codespaces"
3. Clique em "Create codespace on main"

### 3. **GitHub Actions** (CI/CD Gratuito)
- Automação de testes
- Deploy automático
- Workflows personalizados

**Exemplo:**
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm test
```

### 4. **GitHub Pages** (Hospedagem Gratuita)
- Hospede sites estáticos gratuitamente
- Domínio personalizado
- HTTPS automático

**Como usar:**
1. Crie um repositório chamado `username.github.io`
2. Faça push do seu código
3. Seu site estará em `https://username.github.io`

---

## 🎓 Google Cloud Credits para Estudantes

Como estudante, você tem acesso a **$50-300 em créditos Google Cloud** por ano!

### Como Obter:

1. **Acesse:** https://cloud.google.com/edu/students
2. **Clique em:** "Get started"
3. **Escolha:** "GitHub Student Developer Pack"
4. **Verifique:** Você precisa estar registrado como estudante

### O que Você Pode Fazer com Google Cloud:

- ✅ Usar **Google Cloud AI** (Vision, Language, Speech)
- ✅ Hospedar aplicações
- ✅ Usar **BigQuery** para análise de dados
- ✅ Usar **Google Cloud Storage** para armazenar arquivos
- ✅ Usar **Compute Engine** para máquinas virtuais

---

## 📦 GitHub Student Developer Pack

Além de OAuth, você tem acesso a um pacote completo de ferramentas gratuitas!

### Incluído no Pack:

| Ferramenta | O que é | Valor |
|---|---|---|
| **GitHub Pro** | Repositórios privados ilimitados | $21/ano |
| **JetBrains IDEs** | IntelliJ, PyCharm, WebStorm | $200+/ano |
| **Namecheap** | Domínio .me grátis por 1 ano | $10/ano |
| **DigitalOcean** | $50 em créditos | $50 |
| **AWS** | $100 em créditos | $100 |
| **Google Cloud** | $50-300 em créditos | $300 |

**Total de valor:** Mais de **$700 em ferramentas gratuitas!**

### Como Obter:

1. Acesse: https://education.github.com/pack
2. Clique em "Get your pack"
3. Verifique sua identidade de estudante
4. Receba acesso a todas as ferramentas

---

## 🔐 Boas Práticas de Segurança

### ✅ Faça:
- ✅ Use senhas fortes no GitHub
- ✅ Ative autenticação de dois fatores (2FA)
- ✅ Revise as permissões das aplicações OAuth regularmente
- ✅ Faça logout quando terminar

### ❌ Não Faça:
- ❌ Compartilhe seu token de acesso pessoal
- ❌ Coloque credenciais no código
- ❌ Use a mesma senha em vários sites
- ❌ Confie em aplicações OAuth desconhecidas

---

## 🆘 Troubleshooting

### Problema: "Erro ao fazer login"

**Solução:**
1. Limpe o cache do navegador
2. Tente em modo incógnito
3. Verifique se JavaScript está habilitado

### Problema: "Permissão negada"

**Solução:**
1. Acesse https://github.com/settings/applications
2. Clique em "Authorized OAuth Apps"
3. Revogue e autorize novamente

### Problema: "Não consigo fazer upload após login"

**Solução:**
1. Verifique se está autenticado (veja seu nome no menu)
2. Limpe o localStorage: `localStorage.clear()`
3. Faça login novamente

---

## 📚 Recursos Adicionais

- **Documentação GitHub OAuth:** https://docs.github.com/en/developers/apps/building-oauth-apps
- **GitHub Student Pack:** https://education.github.com/pack
- **GitHub Copilot:** https://github.com/features/copilot
- **Google Cloud for Students:** https://cloud.google.com/edu/students

---


**Última atualização:** 26/02/2026
**Mantido por:** Clube do Foco
