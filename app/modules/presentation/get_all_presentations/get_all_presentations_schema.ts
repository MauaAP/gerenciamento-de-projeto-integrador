import { z } from "zod";
import { PresentationSchemaArray } from "../get_presentation/get_presentation_schema";
import { STATUS } from "../../../shared/domain/enums/status";

export const GetAllPresentationsRequest = z.object({
    date: z.number({ message: "date deve ser dada em numero" }).optional(),

    groupId: z.string({ message: "groupId deve ser dado em string" }).length(36, "O group id deve conter 36 caracteres").optional(),

    examinationBoardId: z.string({ message: "examinationBoardId deve ser dado em string" }).length(36, "O examinationBoard id deve conter 36 caracteres").optional(),

    status: z.nativeEnum(STATUS, {
            errorMap: () => ({ message: "status deve ser dado entre um dos valores aceitos: SCHEDULED, REVIEWING, COMPLETED" }),
    }).optional()
});

export const GetAllPresentationsResponse = z.object({
    message: z.string(),
    presentations: PresentationSchemaArray
});