import { User } from "app/shared/domain/entities/user";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";
import { BadRequestException, ForbiddenException } from "app/shared/helpers/exceptions";
export interface DeleteUserDTO {
    id: string;
    isAdmin: boolean;
}
export class DeleteUserUseCase{
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({id, isAdmin} : DeleteUserDTO): Promise<User> {
        const existingUser = await this.userRepository.getUserById(id);
        if (!existingUser) {
            throw new BadRequestException("Usuário não esta no banco")
        }
        if (!isAdmin && existingUser.role === "ADMIN"){
            throw new ForbiddenException(
            "Você não tem permissão para remover um admin"
            );
        }
        const deletedUser= await this.userRepository.deleteUserById(id)

        return deletedUser
    }
}