# Car Rental Lab 02

Sistema web full stack para anúncios de automóveis com fluxo de aluguel e compra, cadastro de clientes, autenticação por perfil, aprovação de pedidos e administração do sistema.

## Visão geral

O projeto foi desenvolvido como atividade da disciplina de Laboratório de Desenvolvimento de Software e hoje está organizado como uma aplicação web em duas partes:

- `frontend/`: SPA em React + Vite
- `backend/`: API REST em Flask + SQLAlchemy

O sistema permite:

- navegar pelos automóveis sem login
- cadastrar clientes
- autenticar usuários `ADMIN` e `CLIENTE`
- publicar, editar e excluir anúncios de carros
- enviar pedidos de aluguel e compra
- aprovar, recusar e cancelar pedidos
- acompanhar notificações ligadas aos pedidos
- administrar usuários, anúncios e pedidos

## Stack

### Frontend

- React 18
- Vite 5
- React Router DOM 6
- Axios
- React Hook Form
- React Hot Toast
- Tailwind CSS 3
- Lucide React

### Backend

- Flask 3
- Flask-CORS
- Flask-SQLAlchemy
- SQLAlchemy 2
- Werkzeug
- python-dotenv
- PyMySQL

### Banco de dados

- SQLite por padrão
- suporte a `DATABASE_URL` para trocar o banco
- imagens salvas no banco como BLOB

## Funcionalidades

### Público

- listagem pública de automóveis
- hero visual com carrossel automático de imagens
- filtros por marca, ano, quilometragem e modalidade
- visualização detalhada do anúncio

### Cliente

- cadastro com dados pessoais, profissão, rendas, email e telefone
- login e persistência de sessão no frontend
- criação e manutenção de anúncios próprios
- página de “Meus anúncios”
- criação de pedidos de aluguel ou compra
- página de “Meus pedidos”
- página de “Pedidos recebidos”
- notificações paginadas com respostas dos pedidos

### Admin

- criação, edição, visualização e exclusão de usuários
- listagem global de pedidos
- exclusão administrativa de pedidos
- gerenciamento global dos recursos do sistema

## Arquitetura

```text
Navegador
  -> Frontend React/Vite
  -> /api
  -> Backend Flask
  -> SQLAlchemy
  -> SQLite
```

### Organização do backend

- `auth/`: login e bootstrap do admin padrão
- `cliente/`: cadastro e manutenção de clientes
- `automovel/`: anúncios, fotos e regras dos carros
- `pedido/`: criação e atualização de pedidos
- `usuario/`: gestão administrativa de usuários
- `shared/`: modelos compartilhados

### Organização do frontend

- `src/api/`: clientes HTTP
- `src/components/`: layout, sidebar, modal etc.
- `src/context/`: autenticação no frontend
- `src/pages/`: páginas do sistema
- `src/index.css`: tokens e classes utilitárias do projeto

## Autenticação

O projeto não usa JWT.

O fluxo atual é:

1. o login retorna os dados do usuário
2. o frontend salva o usuário autenticado no `localStorage`
3. a cada requisição autenticada, o frontend envia:
   - `X-User-Role`
   - `X-User-Id`
4. o backend valida autorização com base nesses headers em [backend/security.py](backend/security.py)

## Banco de dados

Por padrão, o backend usa:

```env
DATABASE_URL=sqlite:///carrental.db
```

Na prática, o banco SQLite local é criado em `instance/` durante a execução da aplicação.

Ao subir o backend, o sistema também:

- cria as tabelas automaticamente
- aplica ajustes de compatibilidade em colunas antigas
- garante a existência do administrador padrão

## Conta administrativa padrão

```text
login: admin
senha: admin
```

## Rotas principais

### Frontend

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

### API

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

## Instalação

### Pré-requisitos

- Python 3.9+
- Node.js 18+
- npm

### 1. Clonar o repositório

```bash
git clone https://github.com/felipegiannetti/car-rental-lab02.git
cd car-rental-lab02
```

### 2. Instalar dependências do backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Instalar dependências do frontend

```bash
cd frontend
npm install
cd ..
```

## Execução

### Opção recomendada para desenvolvimento com Vite

Essa opção já combina com o proxy atual do frontend em [frontend/vite.config.js](frontend/vite.config.js).

#### Backend

```bash
python -m flask --app backend.app:create_app --debug run
```

Backend:

```text
http://localhost:5000
```

#### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Opção alternativa com `run.py`

O arquivo [run.py](run.py) inicia o backend na porta `8080`:

```bash
python run.py
```

Se usar essa opção junto com o frontend em modo dev, ajuste o `target` do proxy em [frontend/vite.config.js](frontend/vite.config.js) para `http://localhost:8080`.

## Build do frontend

```bash
cd frontend
npm run build
```

Saída:

```text
frontend/dist
```

## Scripts úteis

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend

- `python -m flask --app backend.app:create_app --debug run`
- `python run.py`
- `python -m flask --app backend.app:create_app routes`

## Estrutura de pastas

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

## Interface e design

O frontend atual segue uma linguagem visual inspirada na comunicação da Localiza Meoo:

- verde lima como cor primária
- verde floresta para áreas de destaque
- cards grandes para anúncios
- hero editorial na listagem de automóveis
- carrossel automático de imagens no topo da vitrine

O projeto mantém uma página de referência visual em:

```text
/design
```

Essa página documenta:

- paleta de cores
- tipografia
- componentes
- catálogo visual da listagem de automóveis
- tokens e padrões da interface

## Regras de negócio importantes

- apenas clientes podem criar pedidos
- administradores não criam pedidos
- o dono do anúncio aprova ou recusa pedidos recebidos
- pedidos de aluguel dependem de disponibilidade
- anúncios podem aceitar aluguel, compra ou ambos
- o frontend envia imagens em base64
- o backend converte e persiste imagens como bytes no banco

## Documentação complementar

- [docs/historiadeusuarios.pdf](docs/historiadeusuarios.pdf)
- [diagramas/](diagramas)

## Diagramas disponíveis

- `diagramas/casosdeuso.png`
- `diagramas/diagrama-componentes.png`
- `diagramas/diagramadeclasses.png`
- `diagramas/diagramadeimplantacao.png`
- `diagramas/diagramadepacotes.png`

## Links úteis

- Repositório: [github.com/felipegiannetti/car-rental-lab02](https://github.com/felipegiannetti/car-rental-lab02)
- React: [https://react.dev/](https://react.dev/)
- Vite: [https://vitejs.dev/](https://vitejs.dev/)
- Flask: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
- SQLAlchemy: [https://docs.sqlalchemy.org/](https://docs.sqlalchemy.org/)
- Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## Autor

- Felipe Giannetti Fontenelle
  - GitHub: [@felipegiannetti](https://github.com/felipegiannetti)
  - Email: [felipegiannettifontenelle@gmail.com](mailto:felipegiannettifontenelle@gmail.com)

## Licença

Este repositório não possui um arquivo de licença definido no momento.
