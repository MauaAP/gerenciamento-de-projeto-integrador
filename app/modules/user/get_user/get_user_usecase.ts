import { User } from "app/shared/domain/entities/user";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { ForbiddenException, NotFoundException } from "app/shared/helpers/exceptions";
export interface GetUserDTO {
  id?: string,
  email?: string,
  isAdmin: boolean
}

export class GetUserUseCase {
    constructor(private readonly UserRepository: IUserRepository) {}

    async execute({id, email, isAdmin} : GetUserDTO): Promise<User> {
        const selectedUser= id 
            ? await this.UserRepository.getUserById(id)
            : await this.UserRepository.getUserByEmail(email!)

        if (!selectedUser) {
            throw new NotFoundException("Usuario nao esta no banco");
        }
        if (!isAdmin && selectedUser.role === "ADMIN"){
            throw new ForbiddenException(
            "Você não tem permissão para vizualizar um admin"
            );
        }

        return selectedUser
    }
}