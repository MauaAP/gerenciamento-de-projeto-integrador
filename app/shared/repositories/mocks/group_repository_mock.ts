import { Group } from "app/shared/domain/entities/group";
import { COURSE } from "app/shared/domain/enums/course";
import { IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";
import { group } from "console";

export class GroupRepositoryMock implements IGroupRepository {
    private groups: Group[] = [
        new Group(
            "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            "TTI101",
            "2 semestre",
            ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5", "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3"],
            2025,
            COURSE.CIC
        ),
        new Group(
            "25f08e4d-e41a-4c5f-9c3b-8835e2f65c43",
            "TTI202",
            "4 semestre",
            ["d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6", "c3d2e4f4-8b1a-47c2-88ff-d3e6d683b5e5"],
            2024,
            COURSE.SIN
        ),
        new Group(
            "36g19f5e-f52b-4d6e-a4d4-9946f3g76d54",
            "TTI303",
            "6 semestre",
            ["a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3", "d4e3f5g5-7h8i-49j0-99gg-h1i2j3k4l5m6"],
            2023,
            COURSE.ENMC
        ),
    ];

    async createGroup(group: Group): Promise<Group> {
        this.groups.push(group)
        return group
    }

    async fetchGroup(): Promise<Group[]> {
        return this.groups
    }

    async getGroupById(group_id: string): Promise<Group | null> {
        return this.groups.find((group) => group.groupId === group_id) || null;
    }

    async getGroupByfilter(user_id: string, sem: string, year: number): Promise<Group | null> {
        return this.groups.find((group) => group.sem === sem && group.year === year && group.userIdList.includes(user_id)) || null;
    }
}