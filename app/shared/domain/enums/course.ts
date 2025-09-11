export enum COURSE{
    ADM= "ADMINISTRACAO",
    ADS= "ANALISE E DESENVOLVIMETO DE SOFTWARE",
    ARQ= "ARQUITETURA",
    CIC= "CIENCIAS DA COMPUTACAO",
    DSN= "DESIGN",
    ECO= "ECONOMIA",
    ENCV= "ENGENHARIA CV",
    ENAL= "ENGENHARIA DE ALIMENTOS",
    ENCP= "ENGENHARIA DA COMPUTACAO",
    ENCA= "ENGENAHRIA DE CONTROLE E AUTOMACAO",
    ENPD= "ENPR",
    ENEL= "ENEL",
    ENMC= "ENMC",
    ENQM= "ENQM",
    IAD= "IAD",
    RIN= "RIN",
    SIN= "SIN"
}

export function toEnum(value: string): COURSE {
    switch(value) {
        case "ADM":
            return COURSE.ADM;
        case "ADS":
            return COURSE.ADS;
        case "ARQ":
            return COURSE.ARQ;
        case "CIC":
            return COURSE.CIC;
        case "DSN":
            return COURSE.DSN;
        case "ECO":
            return COURSE.ECO;
        case "ENCV":
            return COURSE.ENCV;
        case "ENAL":
            return COURSE.ENAL;
        case "ENCP":
            return COURSE.ENCP;
        case "ENCA":
            return COURSE.ENCA;
        case "ENPR":
            return COURSE.ENPD;
        case "ENEL":
            return COURSE.ENEL;
        case "ENMC":
            return COURSE.ENMC;
        case "ENQM":
            return COURSE.ENQM;
        case "IAD":
            return COURSE.IAD;
        case "RIN":
            return COURSE.RIN;
        case "SIN":
            return COURSE.SIN;
        
        default:
            throw new Error("Invalid value");
    }
}