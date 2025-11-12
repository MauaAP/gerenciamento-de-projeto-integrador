# DynamoDB Global Secondary Indexes (GSIs) - Especificação

Este documento detalha todas as Global Secondary Indexes (GSIs) necessárias para o funcionamento correto do sistema usando Single Table Design no DynamoDB.

## Tabela Principal

**Nome da Tabela:** Definido pela variável de ambiente `DYNAMO_USER_TABLE`

**Chaves Primárias:**
- **Partition Key (PK):** `PK` (String)
- **Sort Key (SK):** `SK` (String)

---

## GSI_Email

### Configuração
- **Nome:** `GSI_Email`
- **Status:** Active
- **Partition Key:** `email` (String)
- **Sort Key:** `-` (Nenhum)
- **Read Capacity:** On-demand
- **Write Capacity:** On-demand
- **Projected Attributes:** All

### Uso
Usado para buscar usuários por email no `UserRepositoryDynamoDB.getUserByEmail()`.

### Estrutura dos Itens
- **PK:** `ALUNO#ID`, `PROF#ID`, ou `ADMIN#ID`
- **SK:** `PROFILE`
- **email:** Email do usuário (usado como Partition Key no GSI)

### Exemplo de Query
```typescript
// Buscar usuário por email usando GSI_Email
const items = await this.db.queryAll(
  email,
  undefined,
  "GSI_Email",
  "email"
);
```

---

## GSI_Name

### Configuração
- **Nome:** `GSI_Name`
- **Status:** Active
- **Partition Key:** `name` (String)
- **Sort Key:** `-` (Nenhum)
- **Read Capacity:** On-demand
- **Write Capacity:** On-demand
- **Projected Attributes:** All

### Uso
Usado para buscar parceiros por nome no `PartnerRepositoryDynamoDB.getPartnerByname()`. Tem fallback para scan com FilterExpression caso o GSI não esteja disponível.

### Estrutura dos Itens
- **PK:** `PARTNER#ID`
- **SK:** `METADATA`
- **name:** Nome do parceiro (usado como Partition Key no GSI)

### Exemplo de Query
```typescript
// Buscar parceiro por nome usando GSI_Name
const items = await this.db.queryAll(
  name,
  undefined,
  "GSI_Name",
  "name"
);
```

---

## GSI1

### Configuração
- **Nome:** `GSI1`
- **Status:** Active
- **Partition Key:** `GSI1PK` (String)
- **Sort Key:** `GSI1SK` (String)
- **Read Capacity:** On-demand
- **Write Capacity:** On-demand
- **Projected Attributes:** All

### Uso
Usado para buscar apresentações por aluno no `PresentationRepositoryDynamoDB.getPresentationByFilter()` quando filtrado por `alunoId`.

### Estrutura dos Itens
- **PK:** `APRESENTACAO#ID`
- **SK:** `ALUNO#ID`
- **GSI1PK:** `ALUNO#ID` (usado como Partition Key no GSI)
- **GSI1SK:** `APRESENTACAO#ID` (usado como Sort Key no GSI)

### Exemplo de Query
```typescript
// Buscar apresentações por aluno usando GSI1
const items = await this.db.queryAll(
  `ALUNO#${alunoId}`,
  "APRESENTACAO#",
  "GSI1",
  "GSI1PK"
);
```

### Quando é Criado
O GSI1 é criado quando uma apresentação é criada com `alunoIds` fornecidos. Cada aluno gera um item com `GSI1PK` e `GSI1SK` preenchidos.

---

## GSI2

### Configuração
- **Nome:** `GSI2`
- **Status:** Active
- **Partition Key:** `GSI2PK` (String)
- **Sort Key:** `GSI2SK` (String)
- **Read Capacity:** On-demand
- **Write Capacity:** On-demand
- **Projected Attributes:** All

### Uso
Usado para buscar apresentações por professor no `PresentationRepositoryDynamoDB.getPresentationByFilter()` quando filtrado por `professorId`.

### Estrutura dos Itens
- **PK:** `APRESENTACAO#ID`
- **SK:** `PROF#ID`
- **GSI2PK:** `PROF#ID` (usado como Partition Key no GSI)
- **GSI2SK:** `APRESENTACAO#ID` (usado como Sort Key no GSI)

### Exemplo de Query
```typescript
// Buscar apresentações por professor usando GSI2
const items = await this.db.queryAll(
  `PROF#${professorId}`,
  "APRESENTACAO#",
  "GSI2",
  "GSI2PK"
);
```

### Quando é Criado
O GSI2 é criado quando uma apresentação é criada com `professorIds` fornecidos. Cada professor gera um item com `GSI2PK` e `GSI2SK` preenchidos.

---

## Resumo das GSIs

| GSI | Partition Key | Sort Key | Uso Principal | Entidade |
|-----|--------------|----------|---------------|----------|
| GSI_Email | `email` | - | Buscar usuário por email | User |
| GSI_Name | `name` | - | Buscar parceiro por nome | Partner |
| GSI1 | `GSI1PK` (ALUNO#ID) | `GSI1SK` (APRESENTACAO#ID) | Buscar apresentações por aluno | Presentation |
| GSI2 | `GSI2PK` (PROF#ID) | `GSI2SK` (APRESENTACAO#ID) | Buscar apresentações por professor | Presentation |

---

## Notas Importantes

1. **Todas as GSIs devem estar criadas antes de usar os endpoints que dependem delas.**
2. **GSI_Email e GSI_Name** são usadas para queries diretas por atributo não-chave.
3. **GSI1 e GSI2** são usadas para reverse lookups em relacionamentos muitos-para-muitos (alunos/professores ↔ apresentações).
4. Todas as GSIs estão configuradas com **On-demand capacity mode** para flexibilidade.
5. Todas as GSIs projetam **All attributes** para evitar necessidade de fetch adicional.

---

## Como Criar as GSIs no AWS Console

1. Acesse o DynamoDB Console
2. Selecione a tabela configurada em `DYNAMO_USER_TABLE`
3. Vá para a aba "Indexes"
4. Clique em "Create index"
5. Configure cada GSI conforme especificado acima
6. Aguarde a criação completa (Status: Active)

---

## Validação

Para validar se todas as GSIs estão criadas corretamente:

```bash
# Verificar GSIs via AWS CLI
aws dynamodb describe-table --table-name <TABLE_NAME> --query 'Table.GlobalSecondaryIndexes[*].[IndexName,IndexStatus]' --output table
```

Todas as 4 GSIs devem estar com status `ACTIVE`.

