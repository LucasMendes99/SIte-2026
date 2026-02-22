# Portfólio - Lucas Mendes

Este projeto é um portfólio pessoal em página única (single page), feito para apresentar perfil profissional, habilidades técnicas, projetos e canais de contato.

## Visão geral

O site foi construído com foco em:

- identidade visual moderna (paleta verde esmeralda, gradientes e efeitos de brilho);
- navegação fluida entre seções;
- animações suaves para melhorar a experiência;
- layout responsivo para desktop e mobile.

## Seções do portfólio

### 1. Hero (apresentação principal)

- saudação inicial com nome;
- título com palavras rotativas (`Full-Stack`, `Frontend`, `Backend`, `React`, `Node.js`);
- texto de posicionamento profissional;
- botões de chamada para ação:
  - `Ver Projetos`
  - `Entrar em Contato`;
- imagem de destaque (`img/node.1.png`) com efeito de flutuação.

### 2. Sobre Mim

- resumo de trajetória;
- abordagem de desenvolvimento full stack;
- foco em código limpo, boas práticas e evolução contínua.

### 3. Habilidades

Cards divididos por área:

- `Frontend`: React, Vue.js, TypeScript, HTML/CSS, Tailwind;
- `Backend`: Node.js, Python, PostgreSQL, MongoDB, REST API;
- `Ferramentas`: Git, Docker, Figma, AWS, Linux.

### 4. Projetos Destacados

Galeria com três projetos de exemplo:

- Loja Virtual Completa;
- Dashboard Analytics;
- API de Autenticação.

Cada card apresenta descrição, stack tecnológica e link de acesso.

### 5. Contato

Formulário funcional com envio real para e-mail usando:

- API serverless da Vercel (`/api/contato`);
- Resend para envio de e-mails;
- hCaptcha + honeypot para proteção anti-spam.

## Recursos visuais e interativos

- barra de progresso de rolagem no topo;
- fundo com blobs animados;
- header com efeito ao rolar a página;
- menu mobile com abertura/fechamento;
- rolagem suave para âncoras internas;
- animações de entrada ao scroll usando `IntersectionObserver`.

## Tecnologias utilizadas

- HTML5;
- CSS3 (variáveis CSS, animações, responsividade);
- JavaScript Vanilla;
- Vercel Functions (Node.js);
- Resend (envio de e-mails);
- hCaptcha (anti-spam);
- Tailwind CSS via CDN (classes utilitárias no HTML);
- Google Fonts (`Poppins`);
- Fontshare (`Clash Display`).

## Estrutura do projeto

```text
.
├── api/
│   └── contato.js
├── index.html
├── styles.css
├── script.js
├── package.json
├── vercel.json
└── img/
    └── node.2.png
```

## Como executar localmente

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto.
3. Instale dependências:
   - `npm install`
4. Rode em desenvolvimento com Vercel:
   - `npm run dev`
5. Acesse a URL local que o comando mostrar (normalmente `http://localhost:3000`).

Observação: para o formulário funcionar, configure as variáveis de ambiente abaixo.

## Variáveis de ambiente (Vercel)

Configure no painel da Vercel (Project Settings > Environment Variables):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (seu e-mail de destino)
- `CONTACT_FROM_EMAIL` (ex.: `contato@seudominio.com`)
- `HCAPTCHA_SECRET`
- `HCAPTCHA_SITE_KEY`

## Setup do Resend (entrega de e-mail)

1. Crie conta no Resend e gere a API key.
2. Adicione e valide seu domínio de envio no Resend.
3. Configure DNS (SPF/DKIM) conforme instruções do Resend.
4. Use esse domínio no `CONTACT_FROM_EMAIL`.

Sem SPF/DKIM, o e-mail pode cair em spam.

## Fluxo do formulário

1. Usuário preenche `nome`, `email`, `celular`, `mensagem`.
2. Usuário resolve o hCaptcha.
3. Frontend envia JSON para `POST /api/contato`.
4. API valida dados + honeypot + captcha.
5. API envia:
   - e-mail para você;
   - confirmação automática para o visitante.

## Pontos para personalização rápida

- dados pessoais e textos principais: `index.html`;
- e-mail, GitHub e LinkedIn: seção `#contato` em `index.html`;
- lógica de envio e captcha no frontend: `script.js`;
- validações e envio de e-mail no backend: `api/contato.js`;
- projetos e stacks: seção `#projetos` em `index.html`;
- paleta de cores e estilo geral: variáveis `:root` em `styles.css`;
- comportamentos de interação: `script.js`.

## Status

Projeto pronto como base de portfólio pessoal, com estrutura clara para evolução futura.
