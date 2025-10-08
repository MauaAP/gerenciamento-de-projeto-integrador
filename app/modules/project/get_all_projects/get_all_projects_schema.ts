import { z } from "zod";

const ProjectSchema= z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        partnerName: z.string(),
        extensionHours: z.number().optional()
    })
)

export const GetAllProjectsResponse= z.object({
    message: z.string(),
    projects:  ProjectSchema
});