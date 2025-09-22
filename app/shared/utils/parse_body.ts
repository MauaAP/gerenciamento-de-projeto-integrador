import { ZodType } from "zod";
import { BadRequestException } from "../helpers/exceptions";

export function parseBody<T>(schema: ZodType<T, any, any>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    // Gera lista de erros detalhados
    const errors = result.error.errors.map((err) => ({
      path: err.path.join("."),   // ex: "email"
      message: err.message        // ex: "Endereço de e-mail inválido"
    }));
    throw new BadRequestException(errors);
  }
  return result.data;
}
