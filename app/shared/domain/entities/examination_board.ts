export class ExaminationBoard{
    constructor(
        public examinationBoardId: string,
        public professorIdList: string[]
    ) {}

    toJson(): {
        examinationBoardId: string,
        professorIdList: string[]
    } {
        return {
            examinationBoardId: this.examinationBoardId,
            professorIdList: this.professorIdList
        };
    }

    static fromJson(json: {
        examinationBoardId: string;
        professorIdList: string[];
    }): ExaminationBoard {
        return new ExaminationBoard(json.examinationBoardId, json.professorIdList)
    }
}