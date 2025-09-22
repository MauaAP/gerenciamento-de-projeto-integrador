import { Partner } from "../../../shared/domain/entities/partner";
import { z } from "zod";

export const GetAllPartnersResponse= z.object({
    message: z.string(),
    partnerList: z.array(z.instanceof(Partner))
})