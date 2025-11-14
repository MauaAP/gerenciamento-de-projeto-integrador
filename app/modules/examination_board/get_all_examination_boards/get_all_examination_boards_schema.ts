import { z } from "zod";
import { ExaminationBoardArraySchema } from "../get_examination_board/get_examination_board_schema";

export const GetAllExaminationBoardsResponse= z.object({
    message: z.string(),
    examinationBoards: ExaminationBoardArraySchema
})