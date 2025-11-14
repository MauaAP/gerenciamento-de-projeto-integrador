import { z } from "zod";

export const CreateProjectRequest = z.object({
    title: z.string({ message: "Título é obrigatório" }).min(6, "O title deve conter pelo menos 6 caracteres"),
    partnerId: z.string({ message: "Id do parceiro é obrigatório" }).length(36, "O partnerId deve conter 36 caracteres"),
    extensionHours: z.number({ message: "As extensionHours devem ser dadas em numero de horas (number)" }).min(1, { message: "O numero de extensionHours deve ser maior que 0" }).optional()
})

export const ProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    partnerName: z.string(),
    extensionHours: z.number().optional()
})

export const CreateProjectResponse = z.object({
    message: z.string(),
    project: ProjectSchema
})
