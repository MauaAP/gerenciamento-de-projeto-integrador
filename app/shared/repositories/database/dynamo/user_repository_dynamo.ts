import { DynamoDBResources } from "./dynamo_datasource";
import { User } from "../../../domain/entities/user";
import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class UserRepositoryDynamoDB implements IUserRepository {
  private db: DynamoDBResources;

  constructor(db: DynamoDBResources) {
    this.db = db;
  }

  async createUser(user: User): Promise<User> {
    await this.db.put(user.toJson(), user.userId, "USER");
    return user;
  }

  async fetchUsers(): Promise<User[]> {
    const items = await this.db.queryAll("USER", undefined, undefined);
    return items.map(User.fromJson);
  }

  async getUserById(userId: string): Promise<User | null> {
    const item = await this.db.get(userId, "USER");
    return item ? User.fromJson(item) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const items = await this.db.queryAll(
      email,
      undefined,
      "GSI_Email",
      "email"
    );
    return items.length > 0 ? User.fromJson(items[0]) : null;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.delete(userId, "USER");
  }

  async updateUser(user: Partial<User> & { userId: string }): Promise<User> {
    const current = await this.getUserById(user.userId);
    if (!current) throw new Error("User not found");

    const updateDict: Partial<User> = {};
    if (user.name) updateDict.name = user.name;
    if (user.email) updateDict.email = user.email;
    if (user.password) updateDict.password = user.password;

    const updated = await this.db.update(user.userId, "USER", updateDict);
    return User.fromJson(updated);
  }
}
