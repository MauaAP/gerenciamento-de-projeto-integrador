import { Group } from "../entities/group";
import { COURSE } from "../enums/course";

export type GroupFilter = {
    userId?: string;
    codSubj?: string;
    yearSem?: number;
    projectId?: string;
    course?: COURSE;
};

export type GroupUpdateOptions = {
    codSubj?: string
    userIdList?: string[],
    yearSem?: number,
    projectId?: string,
    course?: COURSE
}

export interface IGroupRepository {
    createGroup(group : Group): Promise<Group>;

    fetchGroup(): Promise<Group[]>;

    getGroupById(groupId: string): Promise<Group | null>;

    getGroupByFilter(filter: GroupFilter): Promise<Group[] | null>;

    deleteGroup(groupId: string): Promise<Group | null>;

    updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null>;
}