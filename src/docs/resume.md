### 1. System Overview
API de autenticação e gerenciamento de usuários baseada em NestJS. O fluxo padrão recebe a requisição HTTP, valida o DTO, aplica regras de negócio no serviço, persiste via repositório TypeORM e retorna resposta JSON. A documentação interativa é exposta via Swagger.

### 2. Architectural Pattern
Arquitetura modular em camadas:

- **Controller**: entrada HTTP e composição da resposta.
- **Service**: regras de negócio e orquestração.
- **Repository**: acesso a dados e mapeamento de entidades.
- **Infra**: configuração de banco e componentes transversais.

Essa separação melhora testabilidade, isolamento de mudanças e evolução incremental.

### 3. Folder Structure Explanation
- **src**: raiz do código da aplicação.
- **app**: módulo principal e endpoint básico.
- **infra**: infraestrutura compartilhada (ex.: banco).
- **infra/database**: configuração do TypeORM/MySQL.
- **modules**: módulos de domínio.
- **modules/auth**: domínio de autenticação e usuários.
- **modules/auth/dto**: contratos de entrada com validação.
- **modules/auth/entity**: entidade persistida.
- **modules/auth/interfaces**: contratos internos (interfaces).
- **modules/auth/middleware**: validação de autenticação.
- **modules/auth/repositories**: persistência e mapeamento.
- **modules/auth/types**: tipos de resposta.
- **modules/auth/utils**: utilitários (hash, validações).

### 4. Request Lifecycle
1. **Controller** recebe a requisição.
2. **ValidationPipe global** valida e transforma o DTO.
3. **Service** aplica regras (ex.: email único, documento válido, hash).
4. **Repository** executa operações no banco via TypeORM.
5. **Resposta** retorna JSON com mensagem e/ou dados.

### 5. Business Rules
- Email deve ser único antes do cadastro.
- Documento é validado como CPF (brasileiro) ou RNE (estrangeiro).
- Senha é armazenada com hash bcrypt.
- Listagem de usuários usa cache para reduzir carga no banco.

### 6. Data Modeling
Entidade principal: **User** com nome, sobrenome, email, senha, documento, nacionalidade e data de criação.

Validação: DTO com class-validator e regras específicas por campo, garantindo consistência antes de chegar ao serviço.

### 7. Authentication & Authorization
Autenticação básica via header `Authorization: Basic <base64(email:senha)>`. O middleware valida credenciais e bloqueia requisições inválidas antes do controller em rotas protegidas.

### 8. Error Handling Strategy
- Regras de negócio geram `BadRequestException`.
- Autenticação inválida gera `UnauthorizedException`.
- Persistência gera `InternalServerErrorException`.

O NestJS centraliza o tratamento e formata a resposta HTTP.

### 9. How to Extend the System
- **Adicionar endpoint**: criar método no controller, DTO dedicado, regra no service e acesso via repository.
- **Adicionar módulo**: criar pasta em modules com controller/service/repository e registrar no AppModule.
- **Adicionar entidade**: criar em modules/<mod>/entity e incluir no `TypeOrmModule.forFeature`.
- **Evitar breaking changes**: manter contratos de DTO/response estáveis e alinhar middleware com rotas protegidas.

### 10. Important Design Decisions
- DTOs com validação para proteger o domínio antes da regra de negócio.
- Service como orquestrador para concentrar regras e facilitar testes.
- Repository isolado para abstrair a persistência.
- Cache na listagem para melhorar desempenho em leituras frequentes.
- Autenticação básica por simplicidade e aderência ao escopo.
