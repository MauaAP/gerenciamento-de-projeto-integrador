import { User } from "../../../app/shared/domain/entities/user";
import { ROLE } from "../../../app/shared/domain/enums/role";

export class UserBuilder {
  private _userId = "test-id";
  private _name = "Test User";
  private _email = "test@example.com";
  private _role = ROLE.STUDENT;
  private _password = "TestPassword123";

  userId(userId: string) {
    this._userId = userId;
    return this;
  }
  name(name: string) {
    this._name = name;
    return this;
  }
  email(email: string) {
    this._email = email;
    return this;
  }
  role(role: ROLE) {
    this._role = role;
    return this;
  }
  password(password: string) {
    this._password = password;
    return this;
  }
  build(): User {
    return new User(
      this._userId,
      this._name,
      this._email,
      this._role,
      this._password
    );
  }
}

export class RequestCreateUserBuilder {
  private _name = "Test User";
  private _email = "test@example.com";
  private _role = ROLE.STUDENT;
  private _password = "TestPassword123";

  name(name: string) {
    this._name = name;
    return this;
  }
  email(email: string) {
    this._email = email;
    return this;
  }
  role(role: ROLE) {
    this._role = role;
    return this;
  }
  password(password: string) {
    this._password = password;
    return this;
  }
  build() {
    return {
      name: this._name,
      email: this._email,
      role: this._role,
      password: this._password,
    };
  }
}
