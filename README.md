# 🚗 Car Rental Lab 02 - Sistema de Aluguel e Compra de Automóveis

> Aplicação web full stack desenvolvida para a disciplina de Laboratório de Desenvolvimento de Software, com foco em anúncios de veículos, fluxo de aluguel e compra, autenticação por perfil, gerenciamento de pedidos e administração do sistema.

Este projeto demonstra práticas modernas de desenvolvimento web com separação entre frontend e backend, arquitetura modular por domínio, interface responsiva em React e uma API REST em Flask com persistência relacional via SQLAlchemy.

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Frontend](https://img.shields.io/badge/frontend-React%2018-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.1.5-646CFF?logo=vite)
![Backend](https://img.shields.io/badge/backend-Flask%203.0-000000?logo=flask)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![Banco](https://img.shields.io/badge/database-SQLite-blue)

---

## 📚 Índice

- [🔗 Links Úteis](#-links-úteis)
- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🏗 Arquitetura](#-arquitetura)
- [🔐 Autenticação e Perfis](#-autenticação-e-perfis)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [🧭 Rotas Principais](#-rotas-principais)
- [📘 Documentação Complementar](#-documentação-complementar)
- [👥 Autor](#-autor)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## 🔗 Links Úteis

🐙 **Repositório:** [github.com/felipegiannetti/car-rental-lab02](https://github.com/felipegiannetti/car-rental-lab02)
> Código-fonte principal do projeto

📄 **Histórias de Usuário:** [docs/historiadeusuarios.pdf](docs/historiadeusuarios.pdf)
> Documento acadêmico com requisitos e fluxos levantados para o sistema

🧩 **Diagramas:** [diagramas/](diagramas)
> Diagramas de casos de uso, classes, componentes, implantação e pacotes

📧 **Contato:** [felipegiannettifontenelle@gmail.com](mailto:felipegiannettifontenelle@gmail.com)
> Canal para dúvidas, sugestões ou oportunidades

---

## 📝 Sobre o Projeto

### 🎯 Propósito

O **Car Rental Lab 02** foi desenvolvido como trabalho prático da disciplina de **Laboratório de Desenvolvimento de Software**, com o objetivo de construir um sistema web para gerenciamento de anúncios de automóveis, permitindo fluxos de **aluguel** e **compra** em uma mesma plataforma.

O sistema foi pensado para atender diferentes perfis de uso:

- visitantes podem navegar pelos automóveis anunciados
- clientes podem se cadastrar, anunciar veículos e abrir pedidos
- anunciantes podem aprovar, recusar ou acompanhar pedidos recebidos
- administradores podem gerenciar usuários e recursos globais do sistema

### 🎓 Contexto Acadêmico

- **Disciplina:** Laboratório de Desenvolvimento de Software
- **Curso:** Engenharia de Software
- **Instituição:** PUC Minas
- **Período:** 4º período
- **Semestre:** 2026/1

---

## ✨ Funcionalidades Principais

- 🚘 **Vitrine pública de automóveis:** listagem aberta com visual orientado a cards e exibição detalhada dos anúncios
- 🔍 **Filtros de busca:** refinamento por marca, ano, quilometragem e modalidade do anúncio
- 👤 **Cadastro e login de clientes:** autenticação com persistência local da sessão no frontend
- 🏷 **Anúncios próprios:** clientes autenticados podem criar, editar e excluir seus automóveis
- 📥 **Pedidos de aluguel ou compra:** criação de pedidos vinculados a anúncios publicados
- ✅ **Gestão de pedidos recebidos:** o anunciante decide se aprova ou recusa solicitações
- 🔔 **Central de notificações:** acompanhamento das respostas e movimentações relacionadas aos pedidos
- 🛡 **Administração do sistema:** CRUD de usuários e gestão global de pedidos e recursos
- 🖼 **Upload de imagem dos veículos:** frontend envia imagem em base64 e backend persiste como BLOB
- 🎨 **Página de design system:** rota dedicada para documentar paleta, tipografia, componentes e tokens visuais

---

## 🛠 Tecnologias Utilizadas

### 💻 Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 18.2.0 | Construção da interface e composição de páginas |
| **Vite** | 5.1.5 | Dev server, build e HMR |
| **React Router DOM** | 6.22.3 | Roteamento SPA |
| **Axios** | 1.6.7 | Comunicação com a API |
| **React Hook Form** | 7.51.0 | Gerenciamento de formulários |
| **React Hot Toast** | 2.4.1 | Feedback visual de ações |
| **Lucide React** | 0.344.0 | Ícones da interface |
| **Tailwind CSS** | 3.4.1 | Estilização responsiva e utilitária |

### ⚙️ Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| **Flask** | 3.x | API REST principal |
| **Flask-CORS** | 4.x | Liberação de CORS para o frontend |
| **Flask-SQLAlchemy** | 3.1.1+ | Integração ORM no Flask |
| **SQLAlchemy** | 2.x | Persistência e modelagem relacional |
| **Werkzeug** | 3.x | Utilitários web e hash de senha |
| **python-dotenv** | 1.x | Suporte a variáveis de ambiente |
| **PyMySQL** | 1.1.1+ | Suporte opcional a MySQL |

### 🗄 Banco de Dados

| Tecnologia | Uso |
|---|---|
| **SQLite** | Banco padrão em desenvolvimento |
| **DATABASE_URL** | Permite trocar o banco padrão por outro SGBD compatível |

---

## 🏗 Arquitetura

### 📐 Visão Geral

O projeto segue uma arquitetura **full stack desacoplada**, com frontend e backend separados:

```text
Navegador
   ↓
Frontend React + Vite
   ↓
/api
   ↓
Backend Flask
   ↓
SQLAlchemy
   ↓
SQLite
```

### 🧱 Organização do Backend

| Módulo | Responsabilidade |
|---|---|
| **auth** | Login e bootstrap do administrador padrão |
| **cliente** | Cadastro, manutenção e consulta de clientes |
| **automovel** | Regras e operações relacionadas aos anúncios |
| **pedido** | Criação, atualização e decisão de pedidos |
| **usuario** | Gestão administrativa de usuários |
| **shared** | Modelos e estruturas compartilhadas |
| **admin** | Entidade administrativa do sistema |

### 🧩 Organização do Frontend

| Diretório | Responsabilidade |
|---|---|
| **src/api** | Clientes HTTP e integração com a API |
| **src/components** | Layout, sidebar, modal e componentes reutilizáveis |
| **src/context** | Estado global de autenticação |
| **src/pages** | Páginas do sistema |
| **src/utils** | Máscaras e utilitários |
| **src/constants** | Constantes de autenticação e apoio |

### 🔄 Padrões Adotados

- **Arquitetura modular por domínio** no backend
- **SPA com React Router** no frontend
- **Proteção de rotas por perfil** com contexto de autenticação
- **Persistência local da sessão** via `localStorage`
- **Migração de compatibilidade** no startup do backend para colunas legadas

---

## 🔐 Autenticação e Perfis

O projeto não utiliza JWT no estado atual. O fluxo implementado funciona assim:

1. o login retorna os dados do usuário autenticado
2. o frontend salva essas informações no `localStorage`
3. as requisições autenticadas enviam `X-User-Role` e `X-User-Id`
4. o backend valida permissões com base nesses headers

### 👥 Perfis disponíveis

- **ADMIN:** gerencia usuários e recursos globais
- **CLIENTE:** pode anunciar automóveis, abrir pedidos e acompanhar solicitações

### 🔑 Conta administrativa padrão

```text
login: admin
senha: admin
```

---

## 🔧 Instalação e Execução

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Python** 3.9 ou superior
- **Node.js** 18 ou superior
- **npm**
- **Git**

Verifique as versões:

```bash
python --version
node --version
npm --version
```

### 1. Clone o repositório

```bash
git clone https://github.com/felipegiannetti/car-rental-lab02.git
cd car-rental-lab02
```

### 2. Configure o backend

Crie um ambiente virtual e instale as dependências:

```bash
python -m venv .venv
```

No Windows:

```bash
.venv\Scripts\activate
```

No Linux/macOS:

```bash
source .venv/bin/activate
```

Instale os pacotes:

```bash
pip install -r backend/requirements.txt
```

### 3. Configure o frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Variáveis de ambiente

O backend já funciona com valores padrão, mas você pode criar um arquivo `.env` na raiz para personalizar:

```env
DATABASE_URL=sqlite:///carrental.db
SECRET_KEY=dev-secret-key-change-in-prod
```

> Por padrão, o SQLite local é criado em `instance/` durante a execução da aplicação.

### 5. Execute em desenvolvimento

#### Backend

A forma recomendada é rodar o Flask na porta `5000`, que já corresponde ao proxy configurado no Vite:

```bash
python -m flask --app backend.app:create_app --debug run
```

Backend disponível em:

```text
http://localhost:5000
```

#### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

### ▶ Execução alternativa com `run.py`

Também é possível iniciar o backend por:

```bash
python run.py
```

Nesse caso, o servidor sobe na porta `8080`. Se usar essa opção junto com o frontend em modo dev, ajuste o `target` do proxy em `frontend/vite.config.js`.

### 🏗 Build do frontend

```bash
cd frontend
npm run build
```

Os arquivos otimizados serão gerados em:

```text
frontend/dist
```

### 🛠 Scripts disponíveis

| Script | Comando | Descrição |
|---|---|---|
| Frontend dev | `npm run dev` | Inicia o Vite em desenvolvimento |
| Frontend build | `npm run build` | Gera o build de produção |
| Frontend preview | `npm run preview` | Serve o build localmente |
| Backend Flask | `python -m flask --app backend.app:create_app --debug run` | Inicia a API na porta 5000 |
| Backend alternativo | `python run.py` | Inicia a API na porta 8080 |

---

## 📂 Estrutura de Pastas

```text
car-rental-lab02/
├── backend/
│   ├── admin/
│   ├── auth/
│   ├── automovel/
│   ├── cliente/
│   ├── pedido/
│   ├── shared/
│   ├── usuario/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── requirements.txt
│   └── security.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── diagramas/
├── docs/
├── instance/
├── run.py
├── pom.xml
└── README.md
```

---

## 🧭 Rotas Principais

### 🌐 Frontend

- `/login`
- `/register`
- `/automoveis`
- `/automoveis/:id`
- `/automoveis/novo`
- `/automoveis/:id/editar`
- `/meus-anuncios`
- `/pedidos`
- `/pedidos/novo`
- `/pedidos/:id`
- `/pedidos-recebidos`
- `/notificacoes`
- `/usuarios`
- `/usuarios/novo`
- `/usuarios/:tipo/:id`
- `/usuarios/:tipo/:id/editar`
- `/design`

### 🔌 API REST

- `POST /api/auth/login`
- `GET /api/automoveis/`
- `GET /api/automoveis/<id>`
- `POST /api/automoveis/`
- `PUT /api/automoveis/<id>`
- `DELETE /api/automoveis/<id>`
- `GET /api/automoveis/<id>/foto`
- `GET /api/clientes/`
- `GET /api/clientes/<id>`
- `POST /api/clientes/`
- `PUT /api/clientes/<id>`
- `DELETE /api/clientes/<id>`
- `GET /api/clientes/buscar-cpf/<cpf>`
- `GET /api/clientes/<id>/foto`
- `GET /api/pedidos/`
- `GET /api/pedidos/<id>`
- `POST /api/pedidos/`
- `PATCH /api/pedidos/<id>/status`
- `POST /api/pedidos/<id>/cancelar`
- `DELETE /api/pedidos/<id>`
- `GET /api/usuarios/`
- `GET /api/usuarios/<tipo>/<id>`
- `POST /api/usuarios/`
- `PUT /api/usuarios/<tipo>/<id>`
- `DELETE /api/usuarios/<tipo>/<id>`

---

## 📘 Documentação Complementar

### 🧩 Diagramas disponíveis

- `diagramas/casosdeuso.png`
- `diagramas/diagrama-componentes.png`
- `diagramas/diagramadeclasses.png`
- `diagramas/diagramadeimplantacao.png`
- `diagramas/diagramadepacotes.png`

### 📎 Materiais de apoio

- [Histórias de usuário](docs/historiadeusuarios.pdf)
- [Diagramas do projeto](diagramas)

### 📖 Documentações utilizadas

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

---

## 👥 Autor

| Nome | GitHub | Email |
|---|---|---|
| **Felipe Giannetti Fontenelle** | [@felipegiannetti](https://github.com/felipegiannetti) | [felipegiannettifontenelle@gmail.com](mailto:felipegiannettifontenelle@gmail.com) |

---

## 🤝 Contribuição

Contribuições são bem-vindas. Para colaborar com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feat/minha-feature`
3. Faça commit das alterações: `git commit -m "feat: minha alteração"`
4. Envie para o repositório remoto: `git push origin feat/minha-feature`
5. Abra um Pull Request descrevendo as mudanças

### 📝 Sugestão de padrão de commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alterações de documentação |
| `style:` | Ajustes visuais e formatação |
| `refactor:` | Refatoração sem mudança de comportamento |
| `chore:` | Tarefas de manutenção |

---

## 📄 Licença

Este repositório **ainda não possui um arquivo de licença definido**. Caso deseje, a próxima melhoria pode ser adicionar um `LICENSE` formal ao projeto.

---

<div align="center">

**Desenvolvido por [Felipe Giannetti Fontenelle](https://github.com/felipegiannetti)**

📧 Email: [felipegiannettifontenelle@gmail.com](mailto:felipegiannettifontenelle@gmail.com)  
🐙 GitHub: [@felipegiannetti](https://github.com/felipegiannetti)

</div>
