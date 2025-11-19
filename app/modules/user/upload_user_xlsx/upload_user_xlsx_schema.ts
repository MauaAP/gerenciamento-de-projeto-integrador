import { z } from "zod";


//este schema valida apenas se as colunas obrigatórias existem, não o conteúdo de cada linha, ele também serve como parametro para a função parseXlsx saber quais colunas precisa extrair do excel

export const uploadUserXlsxRowSchema = z.object({
    RA: z.string(),
    NOME: z.string()
});