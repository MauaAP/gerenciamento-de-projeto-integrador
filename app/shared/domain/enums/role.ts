export enum ROLE {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  PROFESSOR = "PROFESSOR",
  STUDENT = "STUDENT",
}

export function toEnum(value: string): ROLE {
  switch (value) {
    case "ADMIN":
      return ROLE.ADMIN;
    case "MODERATOR":
      return ROLE.MODERATOR;
    case "PROFESSOR":
      return ROLE.PROFESSOR;
    case "STUDENT":
      return ROLE.STUDENT;
    default:
      throw new Error("Invalid value");
  }
}
