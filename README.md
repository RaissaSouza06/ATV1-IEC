# API Tarefas - Projeto LDW

Este projeto foi desenvolvido para a disciplina de LDW. Trata-se de uma aplicação para o gerenciamento de tarefas, com a API construída em Node.js, utilizando TypeScript, **Sequelize como ORM** e banco de dados PostgreSQL (configurável para rodar localmente ou na nuvem usando Supabase).

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/installation)
- Git

## 🛠 Como instalar e rodar o projeto

**1. Clone o repositório**
```bash
git clone <url-do-teu-repositorio>
cd <pasta-do-projeto>
```

**2. Instalação das Dependências**

Execute os comandos abaixo:
```bash
# Na raiz do projeto
pnpm install

# Na pasta do backend
cd backend
pnpm install
cd ..

# Na pasta do app
cd app
pnpm install
cd ..
```

**3. Configuração das Variáveis de Ambiente**

Crie um arquivo chamado `.env` a partir do arquivo `.env.example`:
```bash
cp .env.example .env
```

Abaixo está a estrutura do arquivo e as instruções de como configurá-lo de acordo com o seu banco de dados:
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configuração do Banco de Dados PostgreSQL
DB_PORT=5432
DB_DIALECT=postgres
DB_NAME=sua_base_de_dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

**4. Executando as Migrations e Iniciando a aplicação**
```bash
# Rodar as migrations do Sequelize para estruturar o banco de dados
pnpm sequelize-cli db:migrate

# Iniciar o servidor
pnpm run dev
```