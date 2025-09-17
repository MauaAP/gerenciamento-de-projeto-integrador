import { Partner } from "../entities/partner";
import { SECTOR } from "../enums/sector";

export type PartnerUpdateOptions = {
    name?: string,
    sector?: SECTOR
}

export interface IPartnerRepository {
    createPartner(partner: Partner): Promise<Partner>;

    fetchPartners(): Promise<Partner[]>;

    getPartnerById(partnerId: string): Promise<Partner | null>

    getPartnerByname(name: string): Promise<Partner | null>

    deletePartnerById(partnerId: string): Promise<Partner | null>

    updatePartner(partnerId: string, updateOptions: PartnerUpdateOptions): Promise<Partner | null>
}