import { z } from "zod";
import { GroupSchemaArray } from "../get_group/get_group_schema";

export const GetAllGroupsResponse= z.object({
    message: z.string(),
    groups: GroupSchemaArray
})