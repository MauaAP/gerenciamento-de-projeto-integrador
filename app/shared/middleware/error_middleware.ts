import { Request, Response, NextFunction } from "express";
import { BaseApplicationException } from "../helpers/exceptions";

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseApplicationException) {
    // Se a exception tem statusCode, use, senão 500
    const status = (err as any).statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
  // Erro desconhecido
  return res.status(500).json({ error: "Erro interno do servidor" });
}
