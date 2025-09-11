import { Partner } from "../entities/partner";

export interface IPartnerRepository {
    createPartner(partner: Partner): Promise<Partner>;

    fetchPartners(): Promise<Partner[]>;

    getPartnerById(partnerId: string): Promise<Partner | null>

    getPartnerByname(name: string): Promise<Partner | null>

    deletePartnerById(partnerId: string): Promise<Partner | null>
}