export class Project {
    constructor(
        public projectId: string,
        public title: string,
        public partnerId: string,
        public extensionHours?: number //hours
    ) {}

    toJson() : {
        projectId: string,
        title: string,
        partnerId: string,
        extensionHours?: number
    } {
        return {
            projectId: this.projectId,
            title: this.title,
            partnerId: this.partnerId,
            extensionHours: this.extensionHours
        };
    }

    static fromJson(json: {
        projectId: string,
        title: string,
        partnerId: string,
        extensionHours?: number
    }) : Project {
        return new Project(json.projectId, json.title, json.partnerId, json.extensionHours)
    }
}