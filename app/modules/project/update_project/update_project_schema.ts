import { z } from "zod";
import { ProjectSchema } from "../create_project/create_project_schema";

export const UpdateProjectRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres"),
    title: z.string().min(6, "O title deve conter pelo menos 6 caracteres").optional(),
    partnerId: z.string({ message: "O partnerId deve ser dado em string" }).length(36, "O partnerId deve conter 36 caracteres").optional(),
    extensionHours: z.number({ message: "As extensionHours devem ser dadas em numero de horas (number)" }).min(0, { message: "O menor número que a extensionHours pode assumir é 0" }).optional()
}).refine(
    (data) => (data.title !== undefined || data.partnerId !== undefined || data.extensionHours !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)



export const UpdateProjectResponse = z.object({
    message: z.string(),
    project: ProjectSchema
})

