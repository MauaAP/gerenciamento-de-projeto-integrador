import { z } from "zod";
import { PresentationSchema } from "../create_presentation/create_presentation_schema";
import { PRESENTATION_STATUS } from "../../../shared/domain/enums/presentation_status";

export const UpdatePresentationRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres"),

    date: z.number({message: "date deve ser dada em numero"}).optional(),

    groupId: z.string({message: "groupId deve ser dado em string"}).length(36, "O group id deve conter 36 caracteres").optional(),

    examinationBoardId: z.string({message: "examinationBoardId deve ser dado em string"}).length(36, "O examinationBoard id deve conter 36 caracteres").optional(),
    
    sala: z.string({message: "A sala deve ser uma string"}).optional(),

    classroomId: z.string({message: "O classroomId deve ser dado em string"}).length(36, "O classroomId deve conter 36 caracteres").optional(),

    status: z.enum(["SCHEDULED", "REVIEWING", "COMPLETED"], {
        errorMap: () => ({ message: "Status deve ser SCHEDULED, REVIEWING ou COMPLETED" })
    }).transform((val) => {
        const statusMap: Record<string, PRESENTATION_STATUS> = {
            "SCHEDULED": PRESENTATION_STATUS.SCHEDULED,
            "REVIEWING": PRESENTATION_STATUS.REVIEWING,
            "COMPLETED": PRESENTATION_STATUS.COMPLETED
        };
        return statusMap[val];
    }).optional()
}).refine(
    (data) => (data.date !== undefined || data.groupId !== undefined || data.examinationBoardId !== undefined || data.sala !== undefined || data.classroomId !== undefined || data.status !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)

export const UpdatePresentationResponse= z.object({
    message: z.string(),
    presentation: PresentationSchema
})