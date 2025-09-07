import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { Encrypt } from "../../../shared/helpers/encrpyt";
import { JWToken } from "../../../shared/helpers/jwtoken";
import { BadRequestException, ForbiddenException } from "../../../shared/helpers/exceptions";

export interface AuthDTO {
  email: string;
  password: string;
}

export class AuthUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ email, password }: AuthDTO) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Usuário ou senha inválidos");
    }
    const valid = await Encrypt.verifyPassword(password, user.password);
    if (!valid) {
      throw new ForbiddenException("Usuário ou senha inválidos");
    }
    const token = JWToken.encode(user.userId);
    return {
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
