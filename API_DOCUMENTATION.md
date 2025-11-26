# API Documentation - Gerenciamento de Projeto Integrador

Documentação completa de todos os endpoints da API de Gerenciamento de Projeto Integrador.

**Base URL:** `/api`

---

## Autenticação

A maioria dos endpoints requer autenticação via JWT Token no header:

```
Authorization: Bearer <token>
```

O token é obtido através do endpoint `/api/login`.

---

## 🔐 Autenticação

### POST /api/login

**Autenticação:** Não requerida

**Body:**
```json
{
  "email": "string (email válido)",
  "password": "string (mínimo 6 caracteres)"
}
```

**Resposta:**
```json
{
  "message": "string",
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string (ADMIN | MODERATOR | PROFESSOR | STUDENT)"
  }
}
```

---

## 👤 Usuário (User)

### POST /api/user

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "name": "string (obrigatório, mínimo 1 caractere)",
  "role": "ADMIN | MODERATOR | PROFESSOR | STUDENT",
  "email": "string (email válido)",
  "password": "string (mínimo 6 caracteres)"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string",
    "email": "string"
  },
  "token": "string"
}
```

---

### GET /api/users

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "users": [
    {
      "id": "string",
      "name": "string",
      "role": "string",
      "email": "string"
    }
  ]
}
```

---

### GET /api/user

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `email` (string, email válido)

**Nota:** Deve informar exatamente um parâmetro (id OU email)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string",
    "email": "string"
  }
}
```

---

### PUT /api/user

**Autenticação:** Sim

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "name": "string (opcional)",
  "email": "string (email válido, opcional)",
  "role": "ADMIN | MODERATOR | PROFESSOR | STUDENT (opcional)",
  "password": "string (mínimo 6 caracteres, opcional)"
}
```

**Nota:** Pelo menos um campo opcional deve ser informado

**Resposta:** 200 OK
```json
{
  "message": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string",
    "email": "string"
  }
}
```

---

### DELETE /api/user

**Autenticação:** Sim

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 🤝 Parceiro (Partner)

### POST /api/partner

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "name": "string (obrigatório)",
  "sector": "EDUCACIONAL | GOVERNAMENTAL | INDUSTRIAL | SAÚDE | ONG | AMBIENTAL | FINANCEIRO"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "partner": {
    "id": "string",
    "name": "string",
    "sector": "string"
  }
}
```

---

### GET /api/partners

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "partners": [
    {
      "id": "string",
      "name": "string",
      "sector": "string"
    }
  ]
}
```

---

### GET /api/partner

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `name` (string, mínimo 1 caractere)

**Nota:** Deve informar exatamente um parâmetro (id OU name)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "partner": {
    "id": "string",
    "name": "string",
    "sector": "string"
  }
}
```

---

### PUT /api/partner

**Autenticação:** Sim

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "name": "string (opcional)",
  "sector": "EDUCACIONAL | GOVERNAMENTAL | INDUSTRIAL | SAÚDE | ONG | AMBIENTAL | FINANCEIRO (opcional)"
}
```

**Nota:** Pelo menos um campo opcional deve ser informado

**Resposta:** 200 OK
```json
{
  "message": "string",
  "partner": {
    "id": "string",
    "name": "string",
    "sector": "string"
  }
}
```

---

### DELETE /api/partner

**Autenticação:** Sim

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 📋 Projeto (Project)

### POST /api/project

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "title": "string (obrigatório, mínimo 6 caracteres)",
  "partnerId": "string (36 caracteres, obrigatório)",
  "extensionHours": "number (opcional, mínimo 1)"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "project": {
    "id": "string",
    "title": "string",
    "partnerName": "string",
    "extensionHours": "number (opcional)"
  }
}
```

---

### GET /api/projects

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "projects": [
    {
      "id": "string",
      "title": "string",
      "partnerName": "string",
      "extensionHours": "number (opcional)"
    }
  ]
}
```

---

### GET /api/project

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `partnerId` (string, 36 caracteres)

**Nota:** Deve informar exatamente um parâmetro (id OU partnerId)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "projects": [
    {
      "id": "string",
      "title": "string",
      "partnerName": "string",
      "extensionHours": "number (opcional)"
    }
  ]
}
```

---

### PUT /api/project

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "title": "string (mínimo 6 caracteres, opcional)",
  "partnerId": "string (36 caracteres, opcional)",
  "extensionHours": "number (mínimo 1, opcional)"
}
```

**Nota:** Pelo menos um campo opcional deve ser informado

**Resposta:** 200 OK
```json
{
  "message": "string",
  "project": {
    "id": "string",
    "title": "string",
    "partnerName": "string",
    "extensionHours": "number (opcional)"
  }
}
```

---

### DELETE /api/project

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 👥 Grupo (Group)

### POST /api/group

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "codSubj": "string (obrigatório)",
  "userIdList": ["string (36 caracteres, mínimo 1 item)"],
  "yearSem": "number (obrigatório, mínimo 1, formato: 202501 ou 202502)",
  "projectId": "string (36 caracteres, obrigatório)",
  "course": "ADMINISTRAÇÃO | ANÁLISE E DESENVOLVIMENTO DE SISTEMAS | ARQUITETURA E URBANISMO | CIÊNCIAS DA COMPUTAÇÃO | DESIGN | ECONOMIA | ENGENHARIA CIVIL | ENGENHARIA DE ALIMENTOS | ENGENHARIA DE COMPUTAÇÃO | ENGENHARIA DE CONTROLE E AUTOMAÇÃO | ENGENHARIA DE PRODUÇÃO | ENGENHARIA ELÉTRICA | ENGENHARIA MECÂNICA | ENGENHARIA QUÍMICA | INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS | RELAÇÕES INTERNACIONAIS | SISTEMAS DE INFORMAÇÃO"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "group": {
    "id": "string",
    "codSubj": "string",
    "userNameList": ["string"],
    "yearSem": "number",
    "project": {
      "title": "string",
      "partnerName": "string",
      "extensionHours": "number (opcional)"
    },
    "course": "string"
  }
}
```

---

### GET /api/groups

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "groups": [
    {
      "id": "string",
      "codSubj": "string",
      "userNameList": ["string"],
      "yearSem": "number",
      "project": {
        "title": "string",
        "partnerName": "string",
        "extensionHours": "number (opcional)"
      },
      "course": "string"
    }
  ]
}
```

---

### GET /api/group

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `userId` (string, 36 caracteres) - OU
- `codSubj` (string) - OU
- `yearSem` (number, mínimo 1) - OU
- `projectId` (string, 36 caracteres) - OU
- `course` (enum COURSE)

**Nota:** Deve informar exatamente um parâmetro (id OU filtros)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "group": [
    {
      "id": "string",
      "codSubj": "string",
      "userNameList": ["string"],
      "yearSem": "number",
      "project": {
        "title": "string",
        "partnerName": "string",
        "extensionHours": "number (opcional)"
      },
      "course": "string"
    }
  ]
}
```

---

### PUT /api/group

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "codSubj": "string (opcional)",
  "userIdList": ["string (36 caracteres, mínimo 1 item, opcional)"],
  "yearSem": "number (mínimo 1, opcional)",
  "projectId": "string (36 caracteres, opcional)",
  "course": "enum COURSE (opcional)"
}
```

**Nota:** Pelo menos um campo opcional deve ser informado

**Resposta:** 200 OK
```json
{
  "message": "string",
  "group": {
    "id": "string",
    "codSubj": "string",
    "userNameList": ["string"],
    "yearSem": "number",
    "project": {
      "title": "string",
      "partnerName": "string",
      "extensionHours": "number (opcional)"
    },
    "course": "string"
  }
}
```

---

### DELETE /api/group

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 🎤 Apresentação (Presentation)

### POST /api/presentation

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "date": "number (obrigatório, milissegundos)",
  "groupId": "string (36 caracteres, obrigatório)",
  "examinationBoardId": "string (36 caracteres, obrigatório)",
  "sala": "string (obrigatório, mínimo 1 caractere)"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "presentation": {
    "id": "string",
    "date": "number",
    "group": {
      "codSubj": "string",
      "userNameList": ["string"],
      "yearSem": "number",
      "project": {
        "title": "string",
        "partnerName": "string",
        "extensionHours": "number (opcional)"
      },
      "course": "string"
    },
    "examinationBoard": {
      "professorNameList": ["string"]
    }
  }
}
```

---

### GET /api/presentations

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "presentations": [
    {
      "id": "string",
      "date": "number",
      "group": {
        "codSubj": "string",
        "userNameList": ["string"],
        "yearSem": "number",
        "project": {
          "title": "string",
          "partnerName": "string",
          "extensionHours": "number (opcional)"
        },
        "course": "string"
      },
      "examinationBoard": {
        "professorNameList": ["string"]
      }
    }
  ]
}
```

---

### GET /api/presentation

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `date` (number, milissegundos) - OU
- `groupId` (string, 36 caracteres) - OU
- `examinationBoardId` (string, 36 caracteres)

**Nota:** Deve informar exatamente um parâmetro (id OU filtros)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "presentations": [
    {
      "id": "string",
      "date": "number",
      "group": {
        "codSubj": "string",
        "userNameList": ["string"],
        "yearSem": "number",
        "project": {
          "title": "string",
          "partnerName": "string",
          "extensionHours": "number (opcional)"
        },
        "course": "string"
      },
      "examinationBoard": {
        "professorNameList": ["string"]
      }
    }
  ]
}
```

---

### PUT /api/presentation

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "date": "number (milissegundos, opcional)",
  "groupId": "string (36 caracteres, opcional)",
  "examinationBoardId": "string (36 caracteres, opcional)",
  "sala": "string (opcional)"
}
```

**Nota:** Pelo menos um campo opcional deve ser informado

**Resposta:** 200 OK
```json
{
  "message": "string",
  "presentation": {
    "id": "string",
    "date": "number",
    "group": {
      "codSubj": "string",
      "userNameList": ["string"],
      "yearSem": "number",
      "project": {
        "title": "string",
        "partnerName": "string",
        "extensionHours": "number (opcional)"
      },
      "course": "string"
    },
    "examinationBoard": {
      "professorNameList": ["string"]
    }
  }
}
```

---

### DELETE /api/presentation

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 🎓 Banca Examinadora (Examination Board)

### POST /api/examination-board

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "professorIdList": ["string (36 caracteres, mínimo 1 item)"]
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "examinationBoard": {
    "id": "string",
    "professorNameList": ["string"]
  }
}
```

---

### GET /api/examination-boards

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "examinationBoards": [
    {
      "id": "string",
      "professorNameList": ["string"]
    }
  ]
}
```

---

### GET /api/examination-board

**Autenticação:** Sim

**Query Params:**
- `id` (string, 36 caracteres) - OU
- `professorId` (string, 36 caracteres)

**Nota:** Deve informar exatamente um parâmetro (id OU professorId)

**Resposta:** 200 OK
```json
{
  "message": "string",
  "examinationBoard": [
    {
      "id": "string",
      "professorNameList": ["string"]
    }
  ]
}
```

---

### PUT /api/examination-board

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres, obrigatório)",
  "newProfessorIdList": ["string (36 caracteres, mínimo 1 item, obrigatório)"]
}
```

**Resposta:** 200 OK
```json
{
  "message": "string",
  "examinationBoard": {
    "id": "string",
    "professorNameList": ["string"]
  }
}
```

---

### DELETE /api/examination-board

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "id": "string (36 caracteres)"
}
```

**Resposta:** 200 OK
```json
{
  "message": "string"
}
```

---

## 🏫 Sala (Classroom)

### POST /api/classroom

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "name": "string (obrigatório, mínimo 1 caractere)",
  "capacity": "number (obrigatório, mínimo 1)",
  "location": "string (opcional)"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "classroom": {
    "id": "string",
    "name": "string",
    "capacity": "number",
    "location": "string (opcional)"
  }
}
```

---

### GET /api/classrooms

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "classrooms": [
    {
      "id": "string",
      "name": "string",
      "capacity": "number",
      "location": "string (opcional)"
    }
  ]
}
```

---

## 📚 Curso (Course)

### POST /api/course

**Autenticação:** Sim (ADMIN ou MODERATOR)

**Body:**
```json
{
  "name": "ADMINISTRAÇÃO | ANÁLISE E DESENVOLVIMENTO DE SISTEMAS | ARQUITETURA E URBANISMO | CIÊNCIAS DA COMPUTAÇÃO | DESIGN | ECONOMIA | ENGENHARIA CIVIL | ENGENHARIA DE ALIMENTOS | ENGENHARIA DE COMPUTAÇÃO | ENGENHARIA DE CONTROLE E AUTOMAÇÃO | ENGENHARIA DE PRODUÇÃO | ENGENHARIA ELÉTRICA | ENGENHARIA MECÂNICA | ENGENHARIA QUÍMICA | INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS | RELAÇÕES INTERNACIONAIS | SISTEMAS DE INFORMAÇÃO",
  "code": "string (opcional)"
}
```

**Resposta:** 201 Created
```json
{
  "message": "string",
  "course": {
    "id": "string",
    "name": "string",
    "code": "string (opcional)"
  }
}
```

---

### GET /api/courses

**Autenticação:** Sim

**Query Params:** Nenhum

**Resposta:** 200 OK
```json
{
  "message": "string",
  "courses": [
    {
      "id": "string",
      "name": "string",
      "code": "string (opcional)"
    }
  ]
}
```

---

## 📝 Enums

### ROLE
- `ADMIN`
- `MODERATOR`
- `PROFESSOR`
- `STUDENT`

### SECTOR
- `EDUCACIONAL`
- `GOVERNAMENTAL`
- `INDUSTRIAL`
- `SAÚDE`
- `ONG`
- `AMBIENTAL`
- `FINANCEIRO`

### COURSE
- `ADMINISTRAÇÃO`
- `ANÁLISE E DESENVOLVIMENTO DE SISTEMAS`
- `ARQUITETURA E URBANISMO`
- `CIÊNCIAS DA COMPUTAÇÃO`
- `DESIGN`
- `ECONOMIA`
- `ENGENHARIA CIVIL`
- `ENGENHARIA DE ALIMENTOS`
- `ENGENHARIA DE COMPUTAÇÃO`
- `ENGENHARIA DE CONTROLE E AUTOMAÇÃO`
- `ENGENHARIA DE PRODUÇÃO`
- `ENGENHARIA ELÉTRICA`
- `ENGENHARIA MECÂNICA`
- `ENGENHARIA QUÍMICA`
- `INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS`
- `RELAÇÕES INTERNACIONAIS`
- `SISTEMAS DE INFORMAÇÃO`

---

## 🔒 Permissões

### Roles com permissões especiais:

- **ADMIN**: Acesso total a todos os endpoints
- **MODERATOR**: Acesso a criação/edição de recursos (não pode criar ADMIN)
- **PROFESSOR**: Acesso de leitura e funcionalidades específicas
- **STUDENT**: Acesso de leitura e funcionalidades específicas

### Endpoints que requerem ADMIN ou MODERATOR:
- POST /api/user
- POST /api/partner
- POST /api/project
- PUT /api/project
- DELETE /api/project
- POST /api/group
- PUT /api/group
- DELETE /api/group
- POST /api/presentation
- PUT /api/presentation
- DELETE /api/presentation
- POST /api/examination-board
- PUT /api/examination-board
- DELETE /api/examination-board
- POST /api/classroom
- POST /api/course

---

## 📌 Notas Importantes

1. **IDs**: Todos os IDs devem ter exatamente 36 caracteres (formato UUID)
2. **Datas**: Usar milissegundos (timestamp) para campos de data
3. **yearSem**: Formato numérico - 202501 (primeiro semestre de 2025) ou 202502 (segundo semestre de 2025)
4. **Autenticação**: A maioria dos endpoints requer token JWT no header `Authorization: Bearer <token>`
5. **Body vs Query Params**: Endpoints GET geralmente usam query params, enquanto POST/PUT/DELETE usam body
6. **Validação**: Todos os campos são validados com Zod - erros retornam 400 Bad Request com detalhes

---

## 🚨 Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Erro de validação ou dados inválidos
- **401 Unauthorized**: Token não fornecido ou inválido
- **403 Forbidden**: Permissão insuficiente
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

