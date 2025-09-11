import { Group } from "../entities/group";

export interface IGroupRepository {
    createGroup(group : Group): Promise<Group>

    fetchGroup(): Promise<Group[]>

    getGroupById(group_id: string): Promise<Group | null>

    getGroupByfilter(user_id: string, sem:string, year: number): Promise<Group | null>

    // updateGroupById()
}