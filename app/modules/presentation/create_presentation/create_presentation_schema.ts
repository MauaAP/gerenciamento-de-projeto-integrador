import { z } from "zod";

export const CreatePresentationRequest= z.object({
    date: z.number({message: "A data deve ser data em numero"}),
    
    groupId: z.string({message: "O groupId deve ser dado em string"}).length(36, "O groupId deve conter 36 caracteres"),

    examinationBoartId: z.string({message: "O examinationBoartId deve ser dado em string"}).length(36, "O examinationBoartId deve conter 36 caracteres"),
    
    sala: z.string({message: "A sala deve ser uma string"}).min(1, "A sala é obrigatória"),
});

export const PresentationSchema= z.object({
    id: z.string(),
    date: z.number(),
    group: z.object({
        codSubj: z.string(),
        userNameList: z.array(z.string()),
        yearSem: z.number(),
        project: z.object({
            title: z.string(),
            partnerName: z.string(),
            extensionHours: z.number().optional()
        }),
        course: z.string()
    }),
    examinationBoard: z.object({
        professorNameList: z.array(z.string())
    })
});

export const CreatePresentationResponse= z.object({
    message: z.string(),
    presentation: PresentationSchema
});