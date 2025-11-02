import { Request, Response, NextFunction } from "express";
import { BaseApplicationException } from "../helpers/exceptions";

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[ErrorMiddleware] ========== ERRO CAPTURADO ==========");
  console.error("[ErrorMiddleware] Error name:", err.name);
  console.error("[ErrorMiddleware] Error message:", err.message);
  console.error("[ErrorMiddleware] Error stack:", err.stack);
  console.error("[ErrorMiddleware] É BaseApplicationException?", err instanceof BaseApplicationException);
  console.error("[ErrorMiddleware] Request path:", req.path);
  console.error("[ErrorMiddleware] Request method:", req.method);
  console.error("[ErrorMiddleware] Error completo:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

  if (err instanceof BaseApplicationException) {
    const status = err.statusCode || 500;
    console.error("[ErrorMiddleware] Status code:", status);
    console.error("[ErrorMiddleware] Tem details?", !!err.details);

    // Se a exceção tiver detalhes (ex: lista de erros do Zod)
    if (err.details) {
      console.error("[ErrorMiddleware] Details:", JSON.stringify(err.details, null, 2));
      return res.status(status).json({ errors: err.details });
    }

    // Senão, devolve apenas a mensagem
    console.error("[ErrorMiddleware] Retornando erro tratado:", err.message);
    return res.status(status).json({ error: err.message });
  }

  // Erro não tratado
  console.error("[ErrorMiddleware] ❌❌❌ ERRO NÃO TRATADO ❌❌❌");
  return res.status(500).json({ error: "Erro interno do servidor" });
}
