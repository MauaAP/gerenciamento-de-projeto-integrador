import { COURSE } from "../enums/course";

export class Course {
    constructor(
        public courseId: string,
        public name: COURSE,
        public code?: string
    ){}

    toJson(): {
        courseId: string,
        name: COURSE,
        code?: string
    } {
        return {
            courseId: this.courseId,
            name: this.name,
            ...(this.code && { code: this.code })
        };
    }

    static fromJson(json: {
        courseId: string;
        name: COURSE;
        code?: string;
    }): Course {
        return new Course(json.courseId, json.name, json.code)
    }
}

