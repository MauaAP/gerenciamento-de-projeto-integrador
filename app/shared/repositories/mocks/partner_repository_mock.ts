import { SECTOR } from "../../../shared/domain/enums/sector";
import { Partner } from "../../domain/entities/partner";
import { IPartnerRepository, PartnerUpdateOptions } from "../../domain/interfaces/IPartnerRepository";

export class PartnerRepoMock implements IPartnerRepository{
    private partners: Partner[] = [
        new Partner(
            "574478f6-a764-4c0e-a24a-febad942156f",
            "Poliedro",
            SECTOR.EDUCATIONAL
        ),
        new Partner(
            "418e7367-75f6-4732-ada4-16034fa7f41e",
            "Metro de São Paulo",
            SECTOR.GOVERNAMENTAL
        ),
        new Partner(
            "61d2408e-8b16-402b-9ee8-e1d9bc9b2ab3",
            "Rokusen",
            SECTOR.HEALTHCARE
        ),
        new Partner(
            "aeb4f4af-c60b-45d0-9355-868752ceb05f",
            "General Motors",
            SECTOR.INDUSTRIAL
        ),
        new Partner(
            "957beed6-7c34-4b5b-a19e-30c4152b52ab",
            "O Semeador",
            SECTOR.ONG
        ),
        new Partner(
            "ab077c10-674c-4b88-b4c5-38cb35ea0ef6",
            "Mastercard",
            SECTOR.FINANCIAL
        ),
        new Partner(
            "d2adbc85-d2f0-4a80-a4a8-ecaed50abaa8",
            "Klabin",
            SECTOR.ENVIRONMENTAL
        )
    ]

    async createPartner(partner: Partner): Promise<Partner>{
        this.partners.push(partner);
        return partner;
    }

    async fetchPartners(): Promise<Partner[]> {
        return this.partners;
    }

    async getPartnerById(partnerId: string): Promise<Partner | null> {
        return this.partners.find((partner) => partner.partnerId === partnerId) || null
    }

    async getPartnerByname(name: string): Promise<Partner | null> {
        return this.partners.find((partners) => partners.name === name) || null
    }

    async deletePartnerById(partnerId: string): Promise<Partner | null> {
        const index= this.partners.findIndex((partner) => partner.partnerId === partnerId);
        if (index === -1) {
            return null
        }
        return this.partners.splice(index, 1)[0];
    }

    async updatePartner(partnerId: string, updateOptions: PartnerUpdateOptions): Promise<Partner | null> {
        const partner= this.partners.find((partner) => partner.partnerId === partnerId) || null;

        if(partner === null){
            return null;
        }

        Object.assign(partner, updateOptions);

        return partner
    }
}