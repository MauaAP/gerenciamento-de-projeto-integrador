import { User } from "../../domain/entities/user";

export interface IUserRepository {
  
  createUser(user: User): Promise<User>;

  fetchUsers(): Promise<User[]>;

  getUserById(userId: string): Promise<User | null>;

  getUserByEmail(email: string): Promise<User | null>;

  deleteUserById(userId: string): Promise<User>;
}
