import { COURSE } from "../enums/course";

export class Group {
    constructor(
        public groupId: string,
        public codSubj: string,
        public userIdList: string[],
        public yearSem: number,
        public projectId: string,
        public course: COURSE,
        public courseId?: string
    ) {}

    toJson() : {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        course: COURSE,
        courseId?: string
    } {
        return {
            groupId: this.groupId,
            codSubj: this.codSubj,
            userIdList: this.userIdList,
            yearSem: this.yearSem,
            projectId: this.projectId,
            course: this.course,
            ...(this.courseId && { courseId: this.courseId })
        };
    }
    
    static fromJson(json: {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        course: COURSE,
        courseId?: string
    }) : Group {
        return new Group(json.groupId, json.codSubj, json.userIdList, json.yearSem, json.projectId ,json.course, json.courseId)
    }
}