import { z } from "zod";

export const GetProjectRequest= z.object({
    id: z.string().length(36, "O id deve conter 36 caracteres").optional(),
    partnerId: z.string().length(36, "O partnerId deve conter 36 caracteres").optional()
}).refine(
    (data) => (data.id !== undefined && data.partnerId === undefined) || (data.id === undefined && data.partnerId !== undefined),
    {
        message: "Você deve informar o id ou o partnerId (exatamente um)"
    }
);

const ProjectSchema= z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        partnerName: z.string(),
        extensionHours: z.number().optional()
    })
)

export const GetProjectResponse= z.object({
    message: z.string(),
    projects: ProjectSchema
})