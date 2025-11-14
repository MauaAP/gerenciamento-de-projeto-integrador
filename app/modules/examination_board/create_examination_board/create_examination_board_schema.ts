import { z } from "zod"

export const CreateExaminationBoardRequest = z.object({
    professorIdList: z.array(
        z.string({ message: "O professorId deve ser dado em string" }).length(36, "O professorId deve conter 36 caracteres"),
        { message: "A lista de professores é obrigatório" }
    )
        .nonempty({ message: "A lista de professores deve conter ao menos um id de professor" }
    ),
});

export const ExaminationBoardSchema= z.object({
    id: z.string(),
    professorNameList: z.array(z.string())
});

export const CreateExaminationBoardResponse= z.object({
    message: z.string(),
    examinationBoard: ExaminationBoardSchema
});