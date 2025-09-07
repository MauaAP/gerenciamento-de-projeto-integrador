import { Request, Response } from "express";
import type { AuthUseCase } from "./auth_usecase";
import { AuthRequest, AuthResponse } from "./auth_schema";
import { parseBody } from "../../../shared/utils/parse_body";
import { ForbiddenException } from "../../../shared/helpers/exceptions";

export class AuthController {
  constructor(private readonly usecase: AuthUseCase) {}

  async handler(req: Request, res: Response) {
    try {
      const { email, password } = parseBody(AuthRequest, req.body);
      const result = await this.usecase.execute({ email, password });
      const response = AuthResponse.parse(result);
      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof ForbiddenException) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
