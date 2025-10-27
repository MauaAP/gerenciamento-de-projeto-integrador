import { z } from "zod";
import { ExaminationBoardSchema } from "../create_examination_board/create_examination_board_schema";

export const GetExaminationBoardRequest= z.object({
    id: z.string({message: "O id deve ser dado em string"}).length(36, "O id deve conter 36 caracteres").optional(),

    professorId:  z.string({message: "O professor id deve ser dado em string"}).length(36, "O professor id deve conter 36 caracteres").optional(),
}).refine(
    (data) => (data.id !== undefined && data.professorId === undefined) || (data.id === undefined && data.professorId !== undefined),
    {
        message: "Você deve informar o id ou o professorId (exatamente um)"
    }
);

export const ExaminationBoardArraySchema= z.array(ExaminationBoardSchema)

export const GetExaminationBoardResponse= z.object({
    message: z.string(),
    examinationBoard: ExaminationBoardArraySchema
})