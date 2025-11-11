import { STATUS } from "../enums/status";

export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoardId: string,
        public classRoomId: string,
        public status: STATUS
    ) { }

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoardId: string,
        classRoomId: string
        status: STATUS
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoardId: this.examinationBoardId,
            classRoomId: this.classRoomId,
            status: this.status
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoardId: string;
        classRoomId: string;
        status: STATUS;
    }): Presentation {
        return new Presentation(json.presentationId, json.date, json.groupId, json.examinationBoardId, json.classRoomId, json.status|| "")
    }
}