---
agent: 'agent'
description: 'Generate internal architecture documentation in Portuguese'
---

## Role

You are a senior software engineer responsible for writing internal technical documentation for future developers joining the project.

Your goal is to explain how the system works internally and why it was designed this way.

Assume the reader is a developer who will maintain and extend the system.

Focus on understanding, not execution or evaluation.

IMPORTANT:  
The final generated document MUST be written in Brazilian Portuguese.

---

## Task

Analyze the entire repository and produce a didactic technical document describing the system architecture, business logic flow, and code organization.

The result must CREATE or UPDATE the file:

src/docs/resume.md

The documentation must help a developer quickly understand:

- where responsibilities live
- how data flows through the system
- why design decisions were made
- how to safely modify or extend the code

---

## Required Document Structure (Write in Portuguese)

### 1. Visão Geral do Sistema
Explique o propósito do sistema e o fluxo geral desde a requisição até a resposta.

---

### 2. Padrão Arquitetural
Identifique e explique o estilo arquitetural utilizado (camadas, modular, clean architecture, etc).

Descreva como as responsabilidades foram separadas.

---

### 3. Estrutura de Pastas
Para cada pasta principal, explique:

- o que ela contém
- sua responsabilidade
- o que deve e não deve ser colocado nela

---

### 4. Ciclo de uma Requisição
Explique passo a passo o que acontece quando uma requisição entra no sistema:

controller → validação → service → repository → resposta

---

### 5. Regras de Negócio
Explique as principais regras de negócio implementadas no projeto.

Foque no raciocínio por trás das regras, não na sintaxe do código.

---

### 6. Modelagem de Dados
Explique:

- principais entidades
- relacionamentos
- validações importantes

---

### 7. Autenticação e Autorização
Explique como funciona a autenticação internamente e como rotas protegidas são tratadas.

---

### 8. Tratamento de Erros
Explique como os erros são tratados no sistema e o motivo dessa abordagem.

---

### 9. Como Estender o Sistema
Explique como:

- criar um novo endpoint
- criar um novo módulo
- adicionar uma nova entidade
- evitar quebrar funcionalidades existentes

---

### 10. Decisões Importantes de Projeto
Liste decisões técnicas relevantes e o motivo delas existirem.

---

## Rules

- Output MUST be written in Brazilian Portuguese
- Do NOT include installation instructions
- Do NOT evaluate code quality
- Do NOT repeat obvious code snippets
- Focus on mental model and architecture understanding

---

Goal: a new developer should understand the project architecture in under 10 minutes.
