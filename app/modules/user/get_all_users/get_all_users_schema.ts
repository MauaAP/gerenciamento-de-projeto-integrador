import { User } from "app/shared/domain/entities/user";
import { z } from "zod";

export const GetAllUsersResponse = z.object({
    message: z.string(),
    userList: z.array(z.instanceof(User))
})