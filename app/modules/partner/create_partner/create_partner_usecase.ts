import { Partner } from "app/shared/domain/entities/partner";
import { SECTOR } from "app/shared/domain/enums/sector";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";
import { BadRequestException } from "app/shared/helpers/exceptions";
export interface CreatePartnerDTO {
    name: string,
    sector: SECTOR
}
export class CreatePartnerUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) {}

    async execute({name, sector}: CreatePartnerDTO) : Promise<Partner> {
        const existingPartner= await this.partnerRepository.getPartnerByname(name)
        
        if (existingPartner) {
            throw new BadRequestException("Email já cadastrado");
        }

        const partnerId= crypto.randomUUID();

        const partner = new Partner(partnerId, name, sector);

        await this.partnerRepository.createPartner(partner)

        return partner
    }
}