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
    new User(
      "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5",
      "Ana Maria Braga",
      "anamaria@maua.br",
      ROLE.PROFESSOR,
      "PanelaVelha2000"
    ),
    new User(
      "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6",
      "Bruce Wayne",
      "bataman@maua.br",
      ROLE.PROFESSOR,
      "IamBatman2008"
    ),
    new User(
      "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7",
      "Peter Parker",
      "spiderman@maua.br",
      ROLE.STUDENT,
      "Spiderman2002"
    ),
    new User(
      "f6g5h7i7-5j6k-4l2m-77gg-h1i2j3k4l5m6",
      "Clark Kent",
      "superman@maua.br",
      ROLE.STUDENT,
      "Superman2001"
    ),
    new User(
      "b7h6i8j8-6k7l-5m3n-88hh-i2j3k4l5m6n7",
      "Diana Prince",
      "wonder@maua.br",
      ROLE.STUDENT,
      "WonderWoman2003"
    ),
    new User(
      "c8h7i9j9-7l8m-6n4o-99ii-j2k3l4m5n6o7",
      "Barry Allen",
      "",
      ROLE.STUDENT,
      "Flash2004"
    ),
    new User(
      "d9i8j0k0-8m9n-7o5p-00jj-k3l4m5n6o7p8",
      "Hal Jordan",
      "green@maua.br",
      ROLE.STUDENT,
      "GreenLantern2005"
    ),
    new User(
      "805c6a8a-450e-414f-a257-bc8979d31f34",
      "Arthur Curry",
      "aquaman@maua.br",
      ROLE.STUDENT,
      "Aquaman2007"
    )


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

  async deleteUserById(userId: string): Promise<User> {
    const index= this.users.findIndex((user) => user.userId === userId);
    return this.users.splice(index, 1)[0];
  }
}
