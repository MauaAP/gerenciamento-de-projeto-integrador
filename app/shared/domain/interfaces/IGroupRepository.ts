import { Group } from "../entities/group";

export type GroupFilter = {
    userId?: string;
    codSubj?: string;
    yearSem?: number;
    projectId?: string;
    courseId?: string;
};

export type GroupUpdateOptions = {
    codSubj?: string
    userIdList?: string[],
    yearSem?: number,
    projectId?: string,
    courseId?: string
}

export interface IGroupRepository {
    createGroup(group : Group): Promise<Group>;

    fetchGroup(): Promise<Group[]>;

    getGroupById(groupId: string): Promise<Group | null>;

    getGroupByFilter(filter: GroupFilter): Promise<Group[] | null>;

    deleteGroup(groupId: string): Promise<Group | null>;

    updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null>;
}