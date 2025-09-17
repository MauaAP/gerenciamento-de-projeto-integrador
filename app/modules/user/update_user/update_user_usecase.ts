import { User } from "app/shared/domain/entities/user";
import { IUserRepository, UserUpdateOptions } from "app/shared/domain/interfaces/IUserRepository";
import { BadRequestException } from "app/shared/helpers/exceptions";

export interface UpdateUserDTO {
    id: string;
    updateOptions: UserUpdateOptions
}

export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({id, updateOptions}: UpdateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.getUserById(id);
        if (!existingUser) {
            throw new BadRequestException("Usuário não esta no banco")
        }

        const updatedUser= await this.userRepository.updateUser(id, updateOptions)

        if (updatedUser === null){
            throw new BadRequestException("Usuário não esta no banco")
        }

        return updatedUser
    }
}