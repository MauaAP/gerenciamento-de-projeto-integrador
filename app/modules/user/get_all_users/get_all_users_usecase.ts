import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return this.userRepository.fetchUsers();
    }
}