## 1. Project Description

API de autenticação e gerenciamento de usuários para teste técnico. Permite criar usuários, gerar credenciais em Basic Auth e listar usuários com proteção por autenticação.

## 2. Tech Stack

- NestJS
- TypeScript
- TypeORM
- MySQL
- Swagger (OpenAPI)
- Class Validator / Class Transformer
- Bcrypt
- Docker / Docker Compose

## 3. Environment Setup

Crie o arquivo .env a partir do modelo:

cp .env.example .env

Variáveis principais:

- DATABASE_HOST: host do MySQL (use mysql ao rodar via Docker)
- DATABASE_PORT: porta do MySQL
- DATABASE_USERNAME: usuário do MySQL
- DATABASE_PASSWORD: senha do MySQL
- DATABASE_NAME: nome do banco
- DATABASE_ROOT_PASSWORD: senha do root (usado no container)
- DATABASE_SYNCHRONIZE: true para sincronizar entidades (desenvolvimento)

Opcional:

- PORT: porta do servidor (padrão 3000)

## 4. Running the Project

### Docker (recomendado)

Build e start:

docker compose up --build

Stop:

docker compose down

Reset de volumes:

docker compose down -v

### Local (Node)

npm install

npm run start:dev

Porém localmente haverá a necessidade de iniciar pelo menos o container do Mysql

## 5. Accessing the API

- API base URL: http://localhost:3000
- Swagger UI: http://localhost:3000/api

## 6. Authentication Guide

Esta API usa Basic Auth para rotas GET em /auth/* (inclui /auth/lista-usuarios e /auth/status).

Passo a passo:

1) Criar usuário em POST /auth/create
2) Login: gere o token Basic com email:senha em Base64
3) Copie o token
4) Autorize no Swagger (Authorize) usando “BasicAuth”
5) Chame as rotas protegidas

Gerar token (exemplo):

echo -n "email@exemplo.com:Senha123" | base64

Use no header:

Authorization: Basic <token>

## 7. Example Requests

Criar usuário:

curl -X POST http://localhost:3000/auth/create \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Gabriel",
    "sobrenome": "Macedo",
    "email": "gabriel@email.com",
    "senha": "Senha123",
    "documento": "123.456.789-09",
    "brasileiro": true
  }'

Login (gerar Basic Auth):

echo -n "gabriel@email.com:Senha123" | base64

Rota protegida (lista usuários):

curl -X GET http://localhost:3000/auth/lista-usuarios \
  -H "Authorization: Basic <token>"

## 8. Useful Scripts

- start: npm run start
- start:dev: npm run start:dev
- test: npm run test
- lint: npm run lint

## 9. Troubleshooting

- .env ausente: crie a partir de .env.example
- Porta em uso: altere PORT ou libere a porta 3000
- Banco não sobe: verifique Docker e credenciais do MySQL
- Falha no container: rode docker compose down -v e suba novamente
