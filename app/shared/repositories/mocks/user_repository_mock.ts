import { ROLE } from "../../../shared/domain/enums/role";
import { User } from "../../domain/entities/user";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository";

export class UserRepoMock implements IUserRepository {
  private users: User[] = [
    new User(
      "7a181d51-4f96-4d97-81b9-16e08aa63742",
      "Matuê",
      "matue@30praum.com.br",
      ROLE.ADMIN,
      "matue30"
    ),
    new User(
      "e9c7d747-9e8e-4d34-935e-473c2c16be83",
      "Zinedine Zidane",
      "zidane@realmadrid.com.es",
      ROLE.MODERATOR,
      "#Cabecada2006"
    ),
    new User(
      "f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389",
      "Luke Skywalker",
      "luke@tattoine.com.us",
      ROLE.STUDENT,
      "#Leia1234"
    ),
    new User(
      "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
      "Roberto Carlos",
      "robertinho@globo.com.br",
      ROLE.PROFESSOR,
      "Perdeu-Perna1900"
    ),
    new User(
      "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",
      "Nuncio Perrela",
      "nunfio@maua.br",
      ROLE.STUDENT,
      "ProjetoDuCaralho123"
    ),
  ];

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async fetchUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find((user) => user.userId === userId) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
}
