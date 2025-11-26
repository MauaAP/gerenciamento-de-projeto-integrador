import { DynamoDBResources } from "./dynamo_datasource";
import { User } from "../../../domain/entities/user";
import type {
  IUserRepository,
  UserUpdateOptions,
} from "../../../domain/interfaces/IUserRepository";

function getUserPK(user: User): string {
  if (user.role === "STUDENT") return `ALUNO#${user.userId}`;
  if (user.role === "PROFESSOR") return `PROF#${user.userId}`;
  if (user.role === "MODERATOR" || user.role === "ADMIN") return `ADMIN#${user.userId}`;
  return `ALUNO#${user.userId}`; // fallback
}

function getUserPKById(userId: string, role: string): string {
  if (role === "STUDENT") return `ALUNO#${userId}`;
  if (role === "PROFESSOR") return `PROF#${userId}`;
  if (role === "MODERATOR" || role === "ADMIN") return `ADMIN#${userId}`;
  return `ALUNO#${userId}`; // fallback
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
    // Tentar todos os prefixos possíveis
    const prefixes = ["ALUNO", "PROF", "ADMIN", "COOD"];
    for (const prefix of prefixes) {
      const pk = `${prefix}#${userId}`;
      const sk = getUserSK();
      const item = await this.db.get(pk, sk);
      if (item) {
        console.log(`[DynamoDB] Busca por ID: ${pk} - Encontrado`);
        return User.fromJson(item);
      }
    }
    
    // Fallback: buscar por scan se não encontrou com prefixos (para usuários antigos)
    // Isso pode acontecer se o usuário foi criado antes da padronização de prefixos
    const allUsers = await this.fetchUsers();
    const foundUser = allUsers.find(user => user.userId === userId);
    if (foundUser) {
      console.log(`[DynamoDB] Busca por ID: ${userId} - Encontrado via scan (usuário antigo)`);
      return foundUser;
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
    console.log(
      `[DynamoDB] Busca por email: ${email} - ${
        items.length > 0 ? "Encontrado" : "Não encontrado"
      }`
    );
    return items.length > 0 ? User.fromJson(items[0]) : null;
  }

  //implementação do metodo que eu adicionei
  async getUserByProfessorName(name: string): Promise<User | null> {
    const items = await this.db.scanAll({
      FilterExpression: "#name = :name AND (#sk = :profile) AND (#role = :professor)",
      ExpressionAttributeNames: { 
        "#name": "name",
        "#sk": "SK",
        "#role": "role"
      },
      ExpressionAttributeValues: { 
        ":name": name,
        ":profile": "PROFILE",
        ":professor": "PROFESSOR"
      },
    });
    console.log(
      `[DynamoDB] Busca por nome de professor: ${name} - ${
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
    
    const currentPk = getUserPK(current);
    const sk = getUserSK();
    const updateDict: Partial<User> = {};
    if (updateOptions.name) updateDict.name = updateOptions.name;
    if (updateOptions.email) updateDict.email = updateOptions.email;
    if (updateOptions.password) updateDict.password = updateOptions.password;
    if (updateOptions.role) updateDict.role = updateOptions.role;

    // Se a role mudou, o PK pode mudar (ALUNO# vs PROF# vs ADMIN#)
    // Precisamos mover o item para a nova PK se necessário
    const newRole = updateOptions.role || current.role;
    const newPk = getUserPKById(userId, newRole);
    
    if (currentPk !== newPk) {
      // Role mudou, precisamos mover o item
      // 1. Buscar item atual completo
      const currentItem = await this.db.get(currentPk, sk);
      if (!currentItem) {
        return null;
      }
      
      // 2. Criar novo item com nova PK e dados atualizados
      const updatedUser = new User(
        current.userId,
        updateOptions.name || current.name,
        updateOptions.email || current.email,
        newRole,
        updateOptions.password || current.password
      );
      
      const newItem = {
        PK: newPk,
        SK: sk,
        ...updatedUser.toJson()
      };
      
      // 3. Criar novo item e deletar antigo
      await this.db.put(newItem, newPk, sk);
      await this.db.delete(currentPk, sk);
      
      console.log(`[DynamoDB] Usuário atualizado e movido: ${currentPk} -> ${newPk}`);
      return updatedUser;
    } else {
      // Role não mudou, apenas atualizar
      const updated = await this.db.update(currentPk, sk, updateDict);
      console.log(`[DynamoDB] Usuário atualizado: ${currentPk}`);
      return User.fromJson(updated);
    }
  }

  async deleteUserById(userId: string): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user) {
      console.log(`[DynamoDB] Tentativa de deletar usuário não encontrado: ${userId}`);
      return null;
    }
    const pk = getUserPK(user);
    const sk = getUserSK();
    await this.db.delete(pk, sk);
    console.log(`[DynamoDB] Usuário deletado: ${pk}`);
    return user;
  }
}
