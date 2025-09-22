import { COURSE } from "../enums/course";

export class Group {
    constructor(
        public groupId: string,
        public codSubj: string,
        public userIdList: string[],
        public yearSem: number,
        public projectId: string,
        public course: COURSE
    ) {}

    toJson() : {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        course: COURSE
    } {
        return {
            groupId: this.groupId,
            codSubj: this.codSubj,
            userIdList: this.userIdList,
            yearSem: this.yearSem,
            projectId: this.projectId,
            course: this.course
        };
    }
    
    static fromJson(json: {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        course: COURSE
    }) : Group {
        return new Group(json.groupId, json.codSubj, json.userIdList, json.yearSem, json.projectId ,json.course)
    }
}