export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoardId: string,
        public classRoomId: string
    ) { }

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoardId: string,
        classRoomId: string
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoardId: this.examinationBoardId,
            classRoomId: this.classRoomId
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoardId: string;
        classRoomId?: string;
    }): Presentation {
        return new Presentation(json.presentationId, json.date, json.groupId, json.examinationBoardId, json.classRoomId || "")
    }
}