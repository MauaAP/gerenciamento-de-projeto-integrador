import { ZodType } from "zod";
import { BadRequestException } from "../helpers/exceptions";

export function parseBody<T>(schema: ZodType<T, any, any>, body: unknown): T {
  console.log("[parseBody] ========== INICIANDO ==========");
  console.log("[parseBody] Body recebido:", JSON.stringify(body, null, 2));
  
  const result = schema.safeParse(body);
  console.log("[parseBody] Resultado do safeParse - success:", result.success);
  
  if (!result.success) {
    console.error("[parseBody] ❌ Validação falhou");
    console.error("[parseBody] Erros do Zod:", JSON.stringify(result.error.errors, null, 2));
    
    // Gera lista de erros detalhados
    const errors = result.error.errors.map((err) => ({
      path: err.path.join("."),   // ex: "email"
      message: err.message        // ex: "email inválido"
    }));

    console.error("[parseBody] Errors formatados:", JSON.stringify(errors, null, 2));

    // Usa a primeira mensagem de erro como mensagem principal
    const primaryErrorMessage = result.error.errors[0]?.message || "Erro de validação";
    console.error("[parseBody] Mensagem principal:", primaryErrorMessage);
    throw new BadRequestException(primaryErrorMessage, errors);
  }
  
  console.log("[parseBody] ✅ Validação OK - dados parseados:", JSON.stringify(result.data, null, 2));
  return result.data;
}
