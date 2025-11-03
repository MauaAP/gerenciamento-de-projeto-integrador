export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoardId: string,
        public classRoom: string
    ) { }

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoardId: string,
        classRoom: string
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoardId: this.examinationBoardId,
            classRoom: this.classRoom
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoardId: string;
        classRoom?: string;
    }): Presentation {
        return new Presentation(json.presentationId, json.date, json.groupId, json.examinationBoardId, json.classRoom || "")
    }
}