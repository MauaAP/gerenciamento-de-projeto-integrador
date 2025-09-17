import { Request, Response } from "express";
import { parseBody } from "../../../shared/utils/parse_body";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import type { CreateUserUseCase } from "./create_user_usecase";
import { RegisterUserRequest, RegisterUserResponse } from "./create_user_schema";

export class CreateUserController {
  constructor(private readonly usecase: CreateUserUseCase) {}

  async handler(req: Request, res: Response) {
    const userFromToken= req.user as UserFromToken;

    const allowedRoles = ["ADMIN", "MODERATOR"];

    if (!allowedRoles.includes(userFromToken.role)) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar este recurso"
      );
    }

    const { name, email, role, password } = parseBody(
      RegisterUserRequest,
      req.body
    );

    if (userFromToken.role === "MODERATOR" && role === "ADMIN"){
      throw new ForbiddenException(
        "Você não tem permissão para adicionar um admin"
      );
    }

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
  }
}
