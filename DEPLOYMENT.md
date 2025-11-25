# Guia de Deploy - ECR e App Runner

Este documento descreve como configurar o deploy automático usando GitHub Actions, Amazon ECR e AWS App Runner.

## Pré-requisitos

1. **ECR Repository criado manualmente**
   - Repositório único: `gerenciamento-de-pi`
   - As imagens são diferenciadas por tags: `dev-{sha}`, `dev-latest`, `prod-{sha}`, `prod-latest`

2. **App Runner Service criado manualmente**
   - Serviço configurado e vinculado ao ECR
   - Será atualizado automaticamente quando houver push na branch `prod`

3. **Secrets do GitHub**
   Configure os seguintes secrets no repositório GitHub (Settings > Secrets and variables > Actions):

   - `AWS_ACCESS_KEY_ID`: Access Key ID da AWS com permissões para ECR e App Runner
   - `AWS_SECRET_ACCESS_KEY`: Secret Access Key correspondente
   - `APP_RUNNER_SERVICE_ARN_PROD`: ARN completo do serviço App Runner
     - Exemplo: `arn:aws:apprunner:us-east-1:123456789012:service/gerenciamento-pi-prod/xyz789ghi012`

## Como funciona

O workflow `.github/workflows/cd.yml` é acionado automaticamente quando há push na branch `prod`.

### Fluxo de deploy:

1. **Build da imagem Docker**
   - Compila o código TypeScript
   - Cria imagem Docker otimizada (multi-stage build)

2. **Push para ECR**
   - Faz login no ECR
   - Faz build da imagem
   - Faz push com tags: `prod-{sha}` e `prod-latest`

3. **Atualização do App Runner**
   - Atualiza o serviço App Runner com a nova imagem
   - Aguarda a conclusão do deploy

## Permissões IAM necessárias

A IAM user/role precisa das seguintes permissões:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apprunner:DescribeService",
        "apprunner:UpdateService"
      ],
      "Resource": [
        "arn:aws:apprunner:*:*:service/*"
      ]
    }
  ]
}
```

## Variáveis de ambiente no App Runner

Certifique-se de configurar as variáveis de ambiente necessárias no App Runner Service:

- `PORT`: Porta do servidor (padrão: 3000)
- `STAGE`: Ambiente (dev/prod)
- `AWS_REGION`: Região da AWS
- `AWS_ACCOUNT_ID`: ID da conta AWS
- `DYNAMO_USER_TABLE`: Nome da tabela DynamoDB
- `JWT_SECRET`: Secret para JWT
- `JWT_EXPIRES_IN`: Tempo de expiração do JWT
- `BUCKET_NAME`: Nome do bucket S3 (se aplicável)
- Outras variáveis específicas da aplicação

## Troubleshooting

### Erro: "Repository does not exist"
- Verifique se o repositório ECR foi criado com o nome correto: `gerenciamento-de-pi`

### Erro: "Service ARN not found"
- Verifique se o secret `APP_RUNNER_SERVICE_ARN_PROD` está configurado corretamente
- O ARN deve estar no formato completo: `arn:aws:apprunner:region:account:service/name/id`

### Erro: "Access Denied"
- Verifique se as credenciais AWS têm as permissões necessárias
- Verifique se o IAM user/role tem acesso ao ECR e App Runner

### Deploy não atualiza o App Runner
- Verifique os logs do GitHub Actions
- Verifique o status do serviço no console AWS App Runner
- O App Runner pode levar alguns minutos para atualizar completamente

