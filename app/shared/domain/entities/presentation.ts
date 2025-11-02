export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoartId: string,
        public sala: string
    ){}

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoartId: string,
        sala: string
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoartId: this.examinationBoartId,
            sala: this.sala
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoartId: string;
        sala?: string;
    }): Presentation {
        return new Presentation(json.presentationId, json.date, json.groupId, json.examinationBoartId, json.sala || "")
    }
}