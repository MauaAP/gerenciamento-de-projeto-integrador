import { ZodType } from "zod";
import { BadRequestException } from "../helpers/exceptions";

/**
 * Valida o corpo da requisição usando um schema Zod.
 * Se inválido, lança InvalidRequest com mensagem de erro.
 * @param schema Schema Zod para validação
 * @param body Corpo da requisição
 * @returns Os dados validados já tipados
 */
export function parseBody<T>(schema: ZodType<T, any, any>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errorMessage = result.error.errors.map((err: any) => err.message).join(", ");
    throw new BadRequestException(errorMessage);
  }
  return result.data;
}
