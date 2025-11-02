import { Group } from "../../../shared/domain/entities/group";
import { IGroupRepository } from "../../../shared/domain/interfaces/IGroupRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteGroupUseCase{
    constructor(
            private readonly groupRepository: IGroupRepository,
        ) {}

    async execute(id: string): Promise<Group>{
        const deletedGroup= await this.groupRepository.deleteGroup(id)

        if(deletedGroup === null){
            throw new NotFoundException("Grupo não está no banco")
        }

        return deletedGroup
    }
}