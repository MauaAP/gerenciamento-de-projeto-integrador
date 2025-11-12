import { PRESENTATION_STATUS } from "../enums/presentation_status";

export class Presentation {
    constructor(
        public presentationId: string,
        public date: number, //miliseconds
        public groupId: string,
        public examinationBoartId: string,
        public sala: string,
        public status: PRESENTATION_STATUS = PRESENTATION_STATUS.SCHEDULED
    ){}

    toJson(): {
        presentationId: string,
        date: number, //miliseconds
        groupId: string,
        examinationBoartId: string,
        sala: string,
        status: PRESENTATION_STATUS
    } {
        return {
            presentationId: this.presentationId,
            date: this.date,
            groupId: this.groupId,
            examinationBoartId: this.examinationBoartId,
            sala: this.sala,
            status: this.status
        };
    }

    static fromJson(json: {
        presentationId: string;
        date: number; //miliseconds
        groupId: string;
        examinationBoartId: string;
        sala?: string;
        status?: PRESENTATION_STATUS | string;
    }): Presentation {
        // Se status não existir ou for inválido, usar SCHEDULED como default
        let status: PRESENTATION_STATUS = PRESENTATION_STATUS.SCHEDULED;
        if (json.status) {
            if (typeof json.status === 'string') {
                status = json.status as PRESENTATION_STATUS;
            } else {
                status = json.status;
            }
        }
        return new Presentation(
            json.presentationId, 
            json.date, 
            json.groupId, 
            json.examinationBoartId, 
            json.sala || "",
            status
        )
    }
}