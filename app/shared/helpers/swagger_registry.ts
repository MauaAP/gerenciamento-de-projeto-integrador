// app/shared/helpers/swagger_registry.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

export function registerSchemas(schemas: Array<{ name: string; schema: any }>) {
  schemas.forEach(({ name, schema }) => registry.register(name, schema));
}

export function registerPaths(paths: Array<any>) {
  paths.forEach((path) => registry.registerPath(path));
}
