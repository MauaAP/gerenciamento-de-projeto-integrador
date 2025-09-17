import { ROLE } from "app/shared/domain/enums/role";
import { z } from "zod";

export const UpdateUserRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caractéres"),
    name: z.string().min(1, "O nome deve ter pelo menos um caracter").optional(),
    email: z.string().email("Endereço de e-mail inválido").optional(),
    role: z.nativeEnum(ROLE).optional(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional()
}).refine(
  (data) => (data.name !== undefined || data.email !== undefined || data.role !== undefined || data.password !== undefined),
  {
    message: "Você deve passar algum atributo para ser alterado"
  }
)

export type UpdateUserRequest= z.infer<typeof UpdateUserRequest>

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
});

export const UpdateUserResponse= z.object({
    message: z.string(),
    user: UserSchema
})

export type UpdateUserResponse = z.infer<typeof UpdateUserResponse>;