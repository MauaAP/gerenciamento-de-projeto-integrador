import { z } from "zod";

export const uploadPresentationXlsxRowSchema = z.object({
    RA: z.string(),
    "Tu-Gp": z.string(),
    Tema: z.string(),
    Sala: z.string(),
    Data: z.string(),
    Hora: z.string(),
    "Banca Profs": z.string(),
});