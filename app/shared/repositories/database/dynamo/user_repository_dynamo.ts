import { DynamoDBResources } from "./dynamo_datasource";
import { User } from "../../../domain/entities/user";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";

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
    await this.db.put(user.toJson(), pk, sk);
    console.log(`[DynamoDB] Usuário criado: ${pk} - ${user.email}`);
    return user;
  }

  async fetchUsers(): Promise<User[]> {
    const roles = ["STUDENT", "PROFESSOR", "MODERATOR", "ADMIN"];
    let allUsers: User[] = [];
    for (const role of roles) {
      const items = await this.db.queryAll(`${role}#`, undefined);
      allUsers = allUsers.concat(items.map(User.fromJson));
    }
    console.log(`[DynamoDB] Busca de usuários: ${allUsers.length} encontrados`);
    return allUsers;
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
    const items = await this.db.queryAll(
      email,
      undefined,
      "GSI_Email",
      "email"
    );
    console.log(`[DynamoDB] Busca por email: ${email} - ${items.length > 0 ? "Encontrado" : "Não encontrado"}`);
    return items.length > 0 ? User.fromJson(items[0]) : null;
  }

  async deleteUser(userId: string): Promise<void> {
    const roles = ["STUDENT", "PROFESSOR", "MODERATOR", "ADMIN"];
    for (const role of roles) {
      const pk = `${role}#${userId}`;
      const sk = getUserSK();
      await this.db.delete(pk, sk);
      console.log(`[DynamoDB] Usuário deletado: ${pk}`);
    }
  }

  async updateUser(user: Partial<User> & { userId: string; role: string }): Promise<User> {
    const current = await this.getUserById(user.userId);
    if (!current) throw new Error("User not found");
    const pk = getUserPK(current);
    const sk = getUserSK();
    const updateDict: Partial<User> = {};
    if (user.name) updateDict.name = user.name;
    if (user.email) updateDict.email = user.email;
    if (user.password) updateDict.password = user.password;
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
