export class Group {
    constructor(
        public groupId: string,
        public codSubj: string,
        public userIdList: string[],
        public yearSem: number,
        public projectId: string,
        public courseId: string
    ) {}

    toJson() : {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        courseId: string
    } {
        return {
            groupId: this.groupId,
            codSubj: this.codSubj,
            userIdList: this.userIdList,
            yearSem: this.yearSem,
            projectId: this.projectId,
            courseId: this.courseId
        };
    }
    
    static fromJson(json: {
        groupId: string,
        codSubj: string
        userIdList: string[],
        yearSem: number,
        projectId: string,
        courseId: string
    }) : Group {
        return new Group(json.groupId, json.codSubj, json.userIdList, json.yearSem, json.projectId ,json.courseId)
    }
}