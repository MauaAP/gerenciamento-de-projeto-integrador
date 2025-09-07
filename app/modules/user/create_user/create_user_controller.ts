import { Request, Response } from "express";
import type { CreateUserUseCase } from "./create_user_usecase";

import {
  RegisterUserRequest,
  RegisterUserResponse,
} from "./create_user_schema";
import { parseBody } from "../../../shared/utils/parse_body";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import type { UserFromToken } from "../../../shared/middleware/jwt_middleware";

export class CreateUserController {
  constructor(private readonly usecase: CreateUserUseCase) {}

  async handler(req: Request, res: Response) {
    try {
      const userFromToken = req.user as UserFromToken;

      const allowedRoles = ["ADMIN", "MODERATOR"];
      if (!allowedRoles.includes(userFromToken.role)) {
        throw new ForbiddenException(
          "Você não tem permissão para criar usuários."
        );
      }

      const { name, email, role, password } = parseBody(
        RegisterUserRequest,
        req.body
      );

      const { user, token } = await this.usecase.execute({
        name,
        email,
        role,
        password,
      });

      const response = RegisterUserResponse.parse({
        message: "Usuário criado com sucesso",
        user: {
          id: user.userId,
          name: user.name,
          role: user.role,
          email: user.email,
        },
        token,
      });

      res.status(201).json(response);
    } catch (error: any) {
      if (error instanceof ForbiddenException) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
