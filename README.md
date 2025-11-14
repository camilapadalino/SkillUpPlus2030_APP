# 🌟 SkillUpPlus 2030+ — Guia de Desenvolvimento, Aprendizagem e ODS
## 👨‍💻 Alunos
- Camila do Prado Padalino - RM98316
- Gabriel Teixeira Machado - RM551570
- Guilherme Brazioli - RM98237

---

## 📘 Sobre o Projeto
> Link para documentação: https://docs.google.com/document/d/1wPWWw0M0KiYYvtMa3fd36LYtxFckCZp2oNicbFh_c4A/edit?usp=sharing

O SkillUpPlus 2030+ é um aplicativo mobile desenvolvido com React Native + Expo, que utiliza Inteligência Artificial, Firebase e conceitos da Agenda 2030 da ONU para orientar pessoas em suas jornadas de aprendizagem e desenvolvimento profissional.

O app ajuda o usuário a descobrir trilhas de estudo personalizadas com base em seus interesses, habilidades atuais, objetivos profissionais e alinhamento com os ODS (Objetivos de Desenvolvimento Sustentável).

Este projeto foi proposto como solução educacional e tecnológica moderna, capaz de conectar impacto social, inovação e qualificação profissional - três pilares fundamentais da Agenda 2030.

--- 

## 🎯 Objetivo do Aplicativo

O principal objetivo do SkillUpPlus 2030+ é ajudar pessoas a evoluírem profissionalmente através de trilhas de aprendizagem personalizadas com suporte de IA.

Para isso, o aplicativo:

✔ Coleta os interesses e metas do usuário <br>
✔ Utiliza IA para recomendar trilhas de conhecimento <br>
✔ Salva as recomendações individualmente no Firebase <br>
✔ Fornece conteúdos estruturados, aulas e objetivos <br>
✔ Apoia aprendizado contínuo, inclusão digital e empregabilidade

---

## 🌍 Conexão com os ODS da ONU
O aplicativo está diretamente alinhado com 4 ODS centrais:

### 📘 ODS 4 — Educação de Qualidade

- Oferece conteúdo acessível e personalização por IA.
- Incentiva aprendizado contínuo e desenvolvimento digital.

### 💼 ODS 8 — Trabalho Decente e Crescimento Econômico

- Foca em habilidades profissionais de alta demanda.
- Orienta para carreiras tecnológicas e inovadoras.

### 🧪 ODS 9 — Indústria, Inovação e Infraestrutura

- Utiliza IA e tecnologias modernas (Firebase, mobile, nuvem).
- Estimula inovação e construção de soluções digitais.

### 🤝 ODS 10 — Redução das Desigualdades

- Democratiza o acesso à educação digital.
- Suporta perfis variados e diferentes realidades socioeconômicas.

---

## 📱 Principais Funcionalidades
### 🔐 Autenticação com Firebase

- Login e Cadastro com e-mail e senha.
- Persistência de sessão com AsyncStorage.
- Logout via Drawer.

### 🧠 Autoavaliação Inteligente

O usuário informa seus interesses, habilidades e metas, e a IA gera:

- Trilhas Recomendadas.
- Caminhos de Estudo.
- Conselhos Personalizados.
- Conteúdos Relacionados aos ODS.

Os resultados são salvos em:

> users/<uid>/recommendations/

### 🎓 Trilhas de Aprendizagem
Trilhas estruturadas como:

- Introdução à IA
- Desenvolvimento Mobile
- Sustentabilidade e ODS

Cada trilha possui descrição, imagem, aulas e tela de detalhes.

### 🧭 Trilhas Recomendadas pela IA
Exibe as recomendações mais recentes em cards clicáveis.

### 📊 Dashboard do Usuário
Exibe:
- Nome do Usuário.
- Interesses.
- Metas.
- Trilhas Salvas.
- Acesso Rápido à Autoavaliação.

---

## 🛠 Tecnologias Utilizadas
### Frontend:
- React Native.
- Expo.
- React Navigation (Stack, Tabs, Drawer).
### Backend:
- Firebase Authentication.
- Firebase Realtime Database.
### Inteligência Artificial:
- API da OpenAI (GPT-4o-mini).
- Prompts Personalizados.
- Recomendação de Trilhas e Orientação.
### Outros
- @react-native-async-storage.
- dotenv + react-native-dotenv.
- Hooks e Context.

---

## 📦 Como Rodar o Projeto
### 1. Instalar dependências
```bash
npm install
```

### 2. Criar arquivo .env
```bash
OPENAI_API_KEY=coloque_sua_chave_aqui
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_DB_URL=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```
### 3. Rodar o app
```bash
npx expo start
```
Escaneie o QR Code no seu celular com o app Expo Go.

---

## 🧪 Como Testar a IA

1. Abra o menu lateral (Drawer). <br>

2. Clique em Autoavaliação. <br>

3. Preencha os campos (interesses, skills, metas).

4. Envie. <br>

5. Veja:
   - Resposta da IA
   - Trilhas Recomendadas na Aba “Trilhas Recomendadas”
  
---

## 📚 Evoluções Futuras

- Sistema de progresso por trilha (ex.: 20% concluído).
- Badges e gamificação.
- Compartilhamento de trilhas.
- Notificações personalizadas.
- Sugestões de aulas baseadas no uso
