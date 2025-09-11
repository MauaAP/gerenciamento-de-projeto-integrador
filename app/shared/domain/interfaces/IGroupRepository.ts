import { Group } from "../entities/group";
import { COURSE } from "../enums/course";

export type GroupByfilter = {
        userId?: string;
        codSubj?: string;
        yearSem?: number;
        projectId?: string;
        course?: COURSE;
};

export interface IGroupRepository {
    createGroup(group : Group): Promise<Group>

    fetchGroup(): Promise<Group[]>

    getGroupById(group_id: string): Promise<Group | null>

    getGroupByfilter(filter: GroupByfilter): Promise<Group[] | null>
}