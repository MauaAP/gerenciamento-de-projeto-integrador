import { z } from "zod";
import { PresentationSchema } from "../create_presentation/create_presentation_schema";
import { STATUS } from "../../../shared/domain/enums/status";

export const UpdatePresentationRequest = z.object({
    id: z.string({ message: "O id deve ser dado em string" }).length(36, "O id deve conter 36 caracteres"),

    date: z.number({ message: "date deve ser dada em numero" }).optional(),

    groupId: z.string({ message: "groupId deve ser dado em string" }).length(36, "O group id deve conter 36 caracteres").optional(),

    examinationBoardId: z.string({ message: "examinationBoardId deve ser dado em string" }).length(36, "O examinationBoard id deve conter 36 caracteres").optional(),

    classRoomId: z.string({ message: "O classRoomId deve ser dado em string" }).length(36, "O classRoomId deve conter 36 caracteres").optional(),

    status: z.nativeEnum(STATUS, {
        errorMap: () => ({ message: "status deve ser dado entre um dos valores aceitos: SCHEDULED, REVIEWING, COMPLETED" }),
      }).optional(),

}).refine(
    (data) => (data.date !== undefined || data.groupId !== undefined || data.examinationBoardId !== undefined || data.classRoomId !== undefined || data.status !== undefined),
    {
        message: "Você deve passar algum atributo para ser alterado"
    }
)

export const UpdatePresentationResponse = z.object({
    message: z.string(),
    presentation: PresentationSchema
})