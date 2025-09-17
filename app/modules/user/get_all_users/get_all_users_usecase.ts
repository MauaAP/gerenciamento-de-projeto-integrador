import { User } from "app/shared/domain/entities/user";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return this.userRepository.fetchUsers();
    }
}