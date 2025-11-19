import { User } from "../../../shared/domain/entities/user";
import { toEnum } from "../../../shared/domain/enums/role";
import { IUserRepository } from "../../../shared/domain/interfaces/IUserRepository";
import { Encrypt } from "../../../shared/helpers/encrpyt";

interface UploadUserXlsxRow {
    RA: string;
    NOME: string;
}

export class UploadUserXlsxUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userData: UploadUserXlsxRow[]): Promise<void> {
        const analyzedRAs = new Set<string>();

        for (const row of userData) {
            const ra = row.RA;
            const name = row.NOME;

            if (!ra) {
                // linha que será ignorada por falta de RA
                continue;
            }

            if (!name) {
                // linha que será ignorada por falta de Nome
                continue;
            }

            if (analyzedRAs.has(ra)) {
                // linha que será ignorada por RA duplicado
                continue;
            }
            else {
                const email = `${ra}@maua.br`;

                const existingUser = await this.userRepository.getUserByEmail(email);

                if (existingUser) {
                    console.log(`Usuário já existe no banco, ignorando RA: ${ra}`);
                    analyzedRAs.add(ra);
                    continue;
                }

                const userId = crypto.randomUUID();
                const role = toEnum("STUDENT");
                const hashedPassword = await Encrypt.hashPassword(ra);

                await this.userRepository.createUser(new User(userId, name, email, role, hashedPassword))

                analyzedRAs.add(ra);

                console.log(`Usuário criado: RA=${ra}, Nome=${name}, Email=${email}`);
            }
        }
    }
}