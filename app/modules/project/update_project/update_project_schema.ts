import { z } from "zod";
import { ProjectSchema } from "../create_project/create_project_schema";

export const UpdateProjectRequest= z.object({
    id: z.string().length(36,  "O id deve conter 36 caracteres"),
    title: z.string().min(6, "O título deve conter pelo menos 6 caracteres").optional(),
    partnerId: z.string().length(36, "O id do parceiro conter 36 caracteres").optional(),
    extensionHours: z.number({message: "As horas de extensão devem ser dadas em numero de horas (number)"}).min(1, {message: "O numero de horas de extensão deve ser maior que 0"}).optional()
}).refine(
    (data) => (data.title !== undefined || data.partnerId !== undefined || data.extensionHours !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)



export const UpdateProjectResponse= z.object({
    message: z.string(),
    project: ProjectSchema
})

