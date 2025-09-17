import { User } from "app/shared/domain/entities/user";
import { IUserRepository } from "app/shared/domain/interfaces/IUserRepository";

export class GetAllUsersUseCase {
    constructor(private readonly UserRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return this.UserRepository.fetchUsers();
    }
}