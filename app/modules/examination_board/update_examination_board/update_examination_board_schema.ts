import { z } from "zod"
import { ExaminationBoardSchema } from "../create_examination_board/create_examination_board_schema";

export const UpdateExaminationBoardRequest= z.object({
    id: z.string({message: "O id deve ser dado em string"}).length(36, "O id deve conter 36 caracteres"),

    newProfessorIdList: z.array(
        z.string({ message: "O professorId deve ser dado em string" }).length(36, "O professorId deve conter 36 caracteres"),
        { message: "A lista de professores é obrigatório" }
    )
        .nonempty({ message: "A lista de professores deve conter ao menos um id de professor" }
    ),
});

export const UpdateExaminationBoardResponse= z.object({
    message: z.string(),
    examinationBoard: ExaminationBoardSchema
})