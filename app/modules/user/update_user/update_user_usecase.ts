import { User } from "../../../shared/domain/entities/user";
import { IUserRepository, UserUpdateOptions } from "../../../shared/domain/interfaces/IUserRepository";
import {NotFoundException } from "../../../shared/helpers/exceptions";
import { Encrypt } from "../../../shared/helpers/encrpyt";

export interface UpdateUserDTO {
    id: string;
    updateOptions: UserUpdateOptions
}

export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}
    async execute({id, updateOptions}: UpdateUserDTO): Promise<User> {
        if (updateOptions.password){
            updateOptions.password= await Encrypt.hashPassword(updateOptions.password)
        }

        const updatedUser= await this.userRepository.updateUser(id, updateOptions)

        if (updatedUser === null){
            throw new NotFoundException("Usuário não está no banco")
        }

        return updatedUser
    }
}