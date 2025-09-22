export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoartId: string
    ){}

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoartId: string
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoartId: this.examinationBoartId
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoartId: string;
    }): Presentation {
        return new Presentation(json.presentationId, json.date, json.groupId, json.examinationBoartId)
    }
}