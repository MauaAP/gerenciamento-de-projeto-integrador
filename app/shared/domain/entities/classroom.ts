export class Classroom {
    constructor(
        public classroomId: string,
        public name: string,
        public capacity: number,
        public location?: string
    ){}

    toJson(): {
        classroomId: string,
        name: string,
        capacity: number,
        location?: string
    } {
        return {
            classroomId: this.classroomId,
            name: this.name,
            capacity: this.capacity,
            ...(this.location && { location: this.location })
        };
    }

    static fromJson(json: {
        classroomId: string;
        name: string;
        capacity: number;
        location?: string;
    }): Classroom {
        return new Classroom(json.classroomId, json.name, json.capacity, json.location)
    }
}

