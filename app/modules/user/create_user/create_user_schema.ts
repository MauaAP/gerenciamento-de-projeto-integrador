import { User } from "../../../shared/domain/entities/user";
import { ROLE } from "../../../shared/domain/enums/role";
import { z } from "zod";

export const RegisterUserRequest = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  role: z.nativeEnum(ROLE, { errorMap: () => ({ message: "Cargo é obrigatório" }) }),
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type RegisterUserRequest = z.infer<typeof RegisterUserRequest>;

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
});

export const RegisterUserResponse = z.object({
  message: z.string(),
  user: UserSchema,
  token: z.string()
});

export type RegisterUserResponse = z.infer<typeof RegisterUserResponse>;
