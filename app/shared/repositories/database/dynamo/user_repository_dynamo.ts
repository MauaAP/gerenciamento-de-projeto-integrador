import { DynamoDBResources } from "./dynamo_datasource";
import { User } from "../../../domain/entities/user";
import type {
  IUserRepository,
  UserUpdateOptions,
} from "../../../domain/interfaces/IUserRepository";

function getUserPK(user: User): string {
  if (user.role === "STUDENT") return `STUDENT#${user.userId}`;
  if (user.role === "PROFESSOR") return `PROFESSOR#${user.userId}`;
  if (user.role === "MODERATOR") return `MODERATOR#${user.userId}`;
  if (user.role === "ADMIN") return `ADMIN#${user.userId}`;
  return user.userId; // fallback
}

function getUserSK(): string {
  return "PROFILE";
}

export class UserRepositoryDynamoDB implements IUserRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createUser(user: User): Promise<User> {
    if (!user.email || !user.name || !user.role || !user.password) {
      throw new Error("Dados obrigatórios do usuário ausentes");
    }
    const pk = getUserPK(user);
    const sk = getUserSK();

    const item = {
      PK: pk,
      SK: sk,
      ...user.toJson(), // contém userId, name, email, role, password
    };

    await this.db.put(item, pk, sk);
    console.log(`[DynamoDB] Usuário criado: ${pk} - ${user.email}`);
    return user;
  }

  async fetchUsers(): Promise<User[]> {
    const items = await this.db.scanAll({
      FilterExpression: "#sk = :profile",
      ExpressionAttributeNames: { "#sk": "SK" },
      ExpressionAttributeValues: { ":profile": "PROFILE" },
    });
    console.log(`[DynamoDB] FetchUsers retornou ${items.length} itens`);
    return items.map(User.fromJson);
  }

  async getUserById(userId: string): Promise<User | null> {
    const roles = ["STUDENT", "PROFESSOR", "MODERATOR", "ADMIN"];
    for (const role of roles) {
      const pk = `${role}#${userId}`;
      const sk = getUserSK();
      const item = await this.db.get(pk, sk);
      if (item) {
        console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
        return User.fromJson(item);
      }
    }
    console.log(`[DynamoDB] Busca por ID: ${userId} - Não encontrado`);
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Necessário criar GSI_Email na tabela
    const items = await this.db.queryAll(
      email,
      undefined,
      "GSI_Email",
      "email"
    );
    console.log(
      `[DynamoDB] Busca por email: ${email} - ${
        items.length > 0 ? "Encontrado" : "Não encontrado"
      }`
    );
    return items.length > 0 ? User.fromJson(items[0]) : null;
  }

  async updateUser(
    userId: string,
    updateOptions: UserUpdateOptions
  ): Promise<User | null> {
    const current = await this.getUserById(userId);
    if (!current) {
      return null;
    }
    const pk = getUserPK(current);
    const sk = getUserSK();
    const updateDict: Partial<User> = {};
    if (updateOptions.name) updateDict.name = updateOptions.name;
    if (updateOptions.email) updateDict.email = updateOptions.email;
    if (updateOptions.password) updateDict.password = updateOptions.password;

    const updated = await this.db.update(pk, sk, updateDict);
    console.log(`[DynamoDB] Usuário atualizado: ${pk}`);
    return User.fromJson(updated);
  }

  async deleteUserById(userId: string): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const pk = getUserPK(user);
    const sk = getUserSK();
    await this.db.delete(pk, sk);
    console.log(`[DynamoDB] Usuário deletado: ${pk}`);
    return user;
  }
}
