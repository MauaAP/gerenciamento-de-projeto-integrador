import { Partner } from "app/shared/domain/entities/partner";
import { IPartnerRepository } from "app/shared/domain/interfaces/IPartnerRepository";

export class GetAllPartnersUseCase {
    constructor(private readonly partnerRepository: IPartnerRepository) {}
    async execute(): Promise<Partner[]>{
        return this.partnerRepository.fetchPartners();
    }
}