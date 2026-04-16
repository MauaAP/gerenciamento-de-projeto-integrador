import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        try {
            const users = await this.userRepository.fetchUsers();
            
            // Validar que retornou um array válido
            if (!Array.isArray(users)) {
                throw new Error("Resposta inválida do repositório");
            }
            
            // Filtrar usuários inválidos (sem userId ou email)
            const validUsers = users.filter(user => 
                user && 
                user.userId && 
                user.email && 
                user.role &&
                user.name
            );
            
            return validUsers;
        } catch (error) {
            // Se for uma exceção conhecida, relançar
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Caso contrário, logar e lançar erro genérico
            console.error("[GetAllUsersUseCase] Erro ao buscar usuários:", error);
            throw new Error("Erro ao buscar lista de usuários");
        }
    }
}