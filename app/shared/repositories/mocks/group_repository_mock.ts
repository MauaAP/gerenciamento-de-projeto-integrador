import { Group } from "app/shared/domain/entities/group";
import { COURSE } from "app/shared/domain/enums/course";
import { GroupFilter, GroupUpdateOptions, IGroupRepository } from "app/shared/domain/interfaces/IGroupRepository";

export class GroupRepositoryMock implements IGroupRepository {
    private groups: Group[] = [
        new Group(
            "14e97d3c-d309-43d4-bfa0-7724e1e54fb2",
            "TTI202",
            ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7", "f6g5h7i7-5j6k-4l2m-77gg-h1i2j3k4l5m6", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"],
            202501,
            "ab077c10-674c-4b88-b4c5-38cb35ea0ef6",
            COURSE.CIC
        ),
        new Group(
            "25f08e4d-e41a-4c5f-9c3b-8835e2f65c43",
            "TTI101",
            ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7", "f6g5h7i7-5j6k-4l2m-77gg-h1i2j3k4l5m6", "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"],
            202401,
            "805c6a8a-450e-414f-a257-bc8979d31f34",
            COURSE.CIC
        ),
        new Group(
            "36g19f5e-f52b-4d6e-a4d4-9946f3g76d54",
            "TEN102",
            ["f6g5h7i7-5j6k-4l2m-77gg-h1i2j3k4l5m6", "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"],
            202502,
            "4d2419c0-4955-4412-900f-e1d49b87f92b",
            COURSE.CIC
        ),
        new Group(
            "d547bcc1-911f-4a7f-b8f6-455b7cbd2184",
            "TTI101",
            ["b7h6i8j8-6k7l-5m3n-88hh-i2j3k4l5m6n7", "c8h7i9j9-7l8m-6n4o-99ii-j2k3l4m5n6o7"],
            202401,
            "805c6a8a-450e-414f-a257-bc8979d31f34",
            COURSE.CIC
        ),
        new Group(
            "3ed81785-bf6c-4e83-9543-d4c7e8c9d27b",
            "RIN201",
            ["d9i8j0k0-8m9n-7o5p-00jj-k3l4m5n6o7p8","805c6a8a-450e-414f-a257-bc8979d31f34"],
            202502,
            "37e8e903-b246-4a1c-8540-7461b8254ceb",
            COURSE.RIN
        ),
        new Group(
            "5b9d4100-13f5-4bd9-92b3-0a420bb3d3e3",
            "ENG101",
            ["f7c9d1e1-9d23-4f6e-94e1-8f45b50f2389", "d9i8j0k0-8m9n-7o5p-00jj-k3l4m5n6o7p8"],
            202301,
            "d5e42571-48f2-4835-9311-d04deefefcd4",
            COURSE.ENPD
        )
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

    async getGroupByFilter(filter: GroupFilter) : Promise<Group[] | null> {
        const result= this.groups.filter((group) => 
            (!filter.userId || group.userIdList.includes(filter.userId)) &&
            (!filter.codSubj || group.codSubj === filter.codSubj) && 
            (!filter.yearSem || group.yearSem === filter.yearSem) && 
            (!filter.projectId || group.projectId === filter.projectId) && 
            (!filter.course || group.course === filter.course)
        );
        return result.length > 0 ? result : null;
    }
    // comentar com o luca que aqui caso nao seja passado nenhum filtro, retorna todos os grupos, sugerir remover o metodo fetchGroup e usar esse metodo para isso

    async deleteGroup(groupId: string): Promise<Group | null> {
        const index= this.groups.findIndex((group) => group.groupId === groupId);

        if (index === -1) return null;

        return this.groups.splice(index, 1)[0];
    }

    async updateGroup(groupId: string, updateOptions: GroupUpdateOptions): Promise<Group | null> {
        const group= this.groups.find((group) => group.groupId === groupId) || null;

        if(group === null){
            return null;
        }

        Object.assign(group, updateOptions);

        return group
    }
}