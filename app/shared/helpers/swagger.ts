import { AuthRequest, AuthResponse } from "../../modules/user/auth/auth_schema";
import { RegisterUserRequest, RegisterUserResponse } from "../../modules/user/create_user/create_user_schema";
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// 🔹 habilita o .openapi() nos schemas
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.register("RegisterUserRequest", RegisterUserRequest);
registry.register("RegisterUserResponse", RegisterUserResponse);
registry.register("AuthRequest", AuthRequest);
registry.register("AuthResponse", AuthResponse);

registry.registerPath({
  method: "post",
  path: "/api/user",
  tags: ["User"],
  request: {
    body: {
      content: { "application/json": { schema: RegisterUserRequest } },
    },
  },
  responses: {
    201: {
      description: "Usuário criado",
      content: { "application/json": { schema: RegisterUserResponse } },
    },
    400: { description: "Erro de validação" },
    403: { description: "Sem permissão (auth)" },
  },
  security: [{ BearerAuth: [] }],
});

registry.registerPath({
  method: "post",
  path: "/api/login",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: AuthRequest } } },
  },
  responses: {
    200: {
      description: "Login realizado",
      content: { "application/json": { schema: AuthResponse } },
    },
    400: { description: "Erro de validação" },
    401: { description: "Credenciais inválidas" },
  },
});

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Gerenciamento PI - API",
    version: "1.0.0",
    description: "Documentação automática gerada via Zod-to-OpenAPI",
  },
  servers: [{ url: "http://localhost:3000" }],
});
