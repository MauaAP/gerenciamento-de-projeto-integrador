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
        // const existingUser = await this.userRepository.getUserById(id);
        // if (!existingUser) {
        //     throw new NotFoundException("Usuário não esta no banco")
        // }
        
        // conversar com o luca de remover essa parte

        if (updateOptions.password){
            updateOptions.password= await Encrypt.hashPassword(updateOptions.password)
        }

        const updatedUser= await this.userRepository.updateUser(id, updateOptions)

        if (updatedUser === null){
            throw new NotFoundException("Usuário não esta no banco")
        }

        return updatedUser
    }
}