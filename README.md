## 1. Project Description

API de autenticação básica e gerenciamento de usuários para teste técnico. Permite cadastrar usuários e listar usuários com proteção via Basic Auth.

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

- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_NAME
- DATABASE_ROOT_PASSWORD
- DATABASE_SYNCHRONIZE
- ENABLE_RATE_LIMITER
- RATE_LIMITER_POINTS
- RATE_LIMITER_DURATION

Observação: o .env.example possui blocos para execução local e via Docker. Ajuste o DATABASE_HOST conforme o modo de execução.

### Rate Limiter

O rate limiter é opcional e controlado por variáveis de ambiente:

- ENABLE_RATE_LIMITER: quando true, o rate limiter é ativado; qualquer outro valor mantém o rate limiter desativado.
- RATE_LIMITER_POINTS: limite de requisições por período (default: 10).
- RATE_LIMITER_DURATION: duração do período em ms (default: 60000).

O rate limiter é aplicado na rota GET /auth/users.

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

Para rodar local, o MySQL precisa estar ativo (pode subir apenas o serviço mysql no Docker).

## 5. Accessing the API

- API base URL: http://localhost:3000
- Swagger UI: http://localhost:3000/api

## 6. Authentication Guide

Esta API usa Basic Auth para a rota GET /auth/users.

Passo a passo:

1) Crie o usuário em POST /auth/users
2) Gere o token Basic com email:senha em Base64
3) Copie o token
4) Autorize no Swagger (Authorize) usando “BasicAuth”
5) Chame a rota protegida

Gerar token (exemplo):

echo -n "email@exemplo.com:Senha123" | base64

Use no header:

Authorization: Basic <token>

## 7. Example Requests

Criar usuário:

curl -X POST http://localhost:3000/auth/users \
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

curl -X GET http://localhost:3000/auth/users \
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

