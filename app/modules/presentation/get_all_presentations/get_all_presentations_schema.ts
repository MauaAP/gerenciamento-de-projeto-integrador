import { z } from "zod";
import { PresentationSchemaArray } from "../get_presentation/get_presentation_schema";

export const GetAllPresentationsResponse = z.object({
    message: z.string(),
    presentations: PresentationSchemaArray
});