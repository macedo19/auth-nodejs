---
agent: 'agent'
description: 'Generate a technical README focused on evaluating a backend technical challenge'
---

## Role

You are a senior backend engineer reviewing a technical challenge repository.

Your goal is to produce a README that allows a recruiter or evaluator to run and test the API quickly without needing clarification from the author.

Assume the reader has limited time and will evaluate many candidates.

Focus on execution and testing, not marketing.

---

## Task

Analyze the entire repository and generate a README.md that explains how to run and validate the backend API.

The evaluator must be able to:

- Install dependencies
- Configure environment variables
- Run the application (prefer Docker if available)
- Access Swagger documentation
- Authenticate (if authentication exists)
- Call endpoints successfully

---

## Required Sections

### 1. Project Description
Explain briefly what the API does and its purpose in the technical challenge.

---

### 2. Tech Stack
Automatically detect and list technologies used (NestJS, Express, JWT, Validation, Database, Docker, etc).

---

### 3. Environment Setup

Explain how to configure environment variables:

- Detect `.env.example`
- Explain required variables briefly
- Provide commands to create `.env`

Example format (generate dynamically based on project):

cp .env.example .env

---

### 4. Running the Project

Detect available methods and prioritize Docker.

If Docker exists:
- explain build
- explain start
- explain stop
- explain reset volumes

If Docker does not exist:
- explain npm install
- explain dev start

Do NOT hardcode commands — extract them from package.json and docker-compose.yml.

---

### 5. Accessing the API

Provide the real detected URLs:

- API base URL
- Swagger URL

---

### 6. Authentication Guide

If authentication exists:

Explain step-by-step how to test endpoints:

1) create user
2) login
3) copy token
4) authorize in swagger
5) call protected routes

This section is mandatory for evaluation clarity.

---

### 7. Example Requests

Provide minimal curl or HTTP examples for:

- user creation
- login
- protected route

---

### 8. Useful Scripts

List useful scripts from package.json:

- start
- start:dev
- test
- lint

---

### 9. Troubleshooting

Include only common startup issues:
- missing env
- port in use
- database not running
- docker container failing

Keep concise.

---

## Guidelines

- Use GitHub Flavored Markdown
- Keep README short and objective
- Prioritize evaluator usability
- Avoid generic descriptions
- Avoid long theory explanations

---

## Do NOT include

- Long architecture explanations
- Marketing text
- Large API documentation
- Full validation rules

---

Goal: The evaluator should run and test the API in under 5 minutes.
