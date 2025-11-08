export class Course {
    constructor(
        public courseId: string,
        public name: string
    ) {}

    toJson(): {
        courseId: string,
        name: string
    } {
        return {
            courseId: this.courseId,
            name: this.name
        };
    }

    static fromJson(json: {
        courseId: string;
        name: string;
    }): Course {
        return new Course(json.courseId, json.name)
    }
}