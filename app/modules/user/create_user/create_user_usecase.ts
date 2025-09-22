import type { ROLE } from "../../../shared/domain/enums/role";
import { User } from "../../../shared/domain/entities/user";
import type { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { Encrypt } from "../../../shared/helpers/encrpyt";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { JWToken } from "../../../shared/helpers/jwtoken";

export interface CreateUserDTO {
  name: string;
  email: string;
  role: ROLE;
  password: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ name, email, password, role }: CreateUserDTO): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Email já cadastrado");
    }

    const hashedPassword = await Encrypt.hashPassword(password);
    const userId = crypto.randomUUID();
    const user = new User(userId, name, email, role, hashedPassword);
    await this.userRepository.createUser(user);
    const token = JWToken.encode(user.userId);
    return { user, token };
  }
}