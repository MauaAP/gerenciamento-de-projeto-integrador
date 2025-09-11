import { SECTOR } from "../enums/sector";

export class Partner {
    constructor (
        public partnerId: string,
        public name: string,
        public sector: SECTOR
    ) {}

    toJson(): {
        partnerId: string;
        name: string,
        sector: SECTOR
    } {
        return {
            partnerId: this.partnerId,
            name: this.name,
            sector: this.sector
        }
    }

    static fromJson(json: {
        partnerId: string,
        name: string,
        sector: SECTOR
    }): Partner {
        return new Partner(json.partnerId, json.name, json.sector);
    }
}