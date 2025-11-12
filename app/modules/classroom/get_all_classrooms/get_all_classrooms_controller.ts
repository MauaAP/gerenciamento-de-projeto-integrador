import { Request, Response } from "express";
import { GetAllClassroomsResponse } from "./get_all_classrooms_schema";
import { GetAllClassroomsUseCase } from "./get_all_classrooms_usecase";

export class GetAllClassroomsController {
    constructor(private readonly usecase: GetAllClassroomsUseCase) {}

    async handler(req: Request, res: Response) {
        const classrooms = await this.usecase.execute();

        const response = GetAllClassroomsResponse.parse({
            message: "Salas retornadas com sucesso",
            classrooms: classrooms.map((classroom) => ({
                id: classroom.classroomId,
                name: classroom.name,
                capacity: classroom.capacity,
                ...(classroom.location && { location: classroom.location })
            }))
        });
        
        res.status(200).json(response)
    }
}

