import {z} from "zod";

export const DeletePresentationRequest = z.object({
    id: z.string({message: "o id deve ser dado em string"}).length(36, "O id deve conter 36 caracteres")
});

export const DeletePresentationResponse = z.object({
    message: z.string()
})