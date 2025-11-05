export class Classroom {
    constructor(
        public classroomId: string,
        public name: string
    ) {} 

    toJson(): {
        classroomId: string,
        name: string
    } {
        return {
            classroomId: this.classroomId,
            name: this.name
        };
    }

    static fromJson(json: {
        classroomId: string;
        name: string;
    }): Classroom {
        return new Classroom(json.classroomId, json.name)
    }
} 