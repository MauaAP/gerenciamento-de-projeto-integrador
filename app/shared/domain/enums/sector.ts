export enum SECTOR {
    EDUCATIONAL= "EDUCACIONAL",
    GOVERNAMENTAL= "GOVERNAMENTAL",
    INDUSTRIAL= "INDUSTRIAL",
    HEALTHCARE = "SAÚDE",
    ONG= "ONG",
    ENVIRONMENTAL = "AMBIENTAL",
    FINANCIAL = "FINANCEIRO"
}

export function toEnum(value: string): SECTOR {
    switch(value) {
        case "EDUCACIONAL":
            return SECTOR.EDUCATIONAL;
        case "GOVERNAMENTAL":
            return SECTOR.GOVERNAMENTAL;
        case "INDUSTRIAL":
            return SECTOR.INDUSTRIAL;
        case "SAÚDE":
            return SECTOR.HEALTHCARE;
        case "ONG":
            return SECTOR.ONG;
        case "AMBIENTAL":
            return SECTOR.ENVIRONMENTAL;
        case "FINANCEIRO":
            return SECTOR.FINANCIAL;
        default:
            throw new Error("Invalid value");
    }
}