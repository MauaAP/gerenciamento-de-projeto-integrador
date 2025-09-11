import exp from "constants";

export enum SECTOR {
    EDUCATIONAL= "EDUCATIONAL",
    GOVERNAMENTAL= "GOVERNAMENTAL",
    INDUSTRIAL= "INDUSTRIAL",
    HEALTHCARE = "HEALTHCARE",
    ONG= "ONG",
    ENVIRONMENTAL = "ENVIRONMENTAL",
    FINANCIAL = "FINANCIAL"
}

export function toEnum(value: string): SECTOR {
    switch(value) {
        case "EDUCATIONAL":
            return SECTOR.EDUCATIONAL;
        case "GOVERNAMENTAL":
            return SECTOR.GOVERNAMENTAL;
        case "INDUSTRIAL":
            return SECTOR.INDUSTRIAL;
        case "HEALTHCARE":
            return SECTOR.HEALTHCARE;
        case "ONG":
            return SECTOR.ONG;
        case "ENVIRONMENTAL":
            return SECTOR.ENVIRONMENTAL;
        case "FINANCIAL":
            return SECTOR.FINANCIAL;
        default:
            throw new Error("Invalid value");
    }
}