import { z } from "zod";
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status";

export const CreatePresentationRequest= z.object({
    date: z.number({message: "A data deve ser data em numero"}),
    
    groupId: z.string({message: "O groupId deve ser dado em string"}).length(36, "O groupId deve conter 36 caracteres"),

    examinationBoartId: z.string({message: "O examinationBoartId deve ser dado em string"}).length(36, "O examinationBoartId deve conter 36 caracteres"),
    
    sala: z.string({message: "A sala deve ser uma string"}).min(1, "A sala é obrigatória"),
    
    status: z.enum(["SCHEDULED", "REVIEWING", "COMPLETED"], {
        errorMap: () => ({ message: "Status deve ser SCHEDULED, REVIEWING ou COMPLETED" })
    }).transform((val) => {
        const statusMap: Record<string, PRESENTATION_STATUS> = {
            "SCHEDULED": PRESENTATION_STATUS.SCHEDULED,
            "REVIEWING": PRESENTATION_STATUS.REVIEWING,
            "COMPLETED": PRESENTATION_STATUS.COMPLETED
        };
        return statusMap[val];
    }).optional().default(PRESENTATION_STATUS.SCHEDULED)
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