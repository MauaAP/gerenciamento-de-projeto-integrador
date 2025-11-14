import { Request, Response } from "express";
import { AuthUseCase } from "./auth_usecase";
import { AuthRequest, AuthResponse } from "./auth_schema";
import { parseBody } from "../../../shared/utils/parse_body";

export class AuthController {
  constructor(private readonly usecase: AuthUseCase) {}

  async handler(req: Request, res: Response) {
    const { email, password } = parseBody(AuthRequest, req.body);
    const result = await this.usecase.execute({ email, password });
    const response = AuthResponse.parse(result);
    res.status(200).json(response);
  }
}
