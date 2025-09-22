import { User } from "../../../shared/domain/entities/user";
import { z } from "zod";

export const GetAllUsersResponse = z.object({
    message: z.string(),
    userList: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
        })
    )
})