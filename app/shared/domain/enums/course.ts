export enum COURSE{
    ADM = "ADMINISTRAÇÃO",
    ADS = "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS",
    ARQ = "ARQUITETURA E URBANISMO",
    CIC = "CIÊNCIAS DA COMPUTAÇÃO",
    DSN = "DESIGN",
    ECO = "ECONOMIA",
    ENCV = "ENGENHARIA CIVIL",
    ENAL = "ENGENHARIA DE ALIMENTOS",
    ENCP = "ENGENHARIA DE COMPUTAÇÃO",
    ENCA = "ENGENHARIA DE CONTROLE E AUTOMAÇÃO",
    ENPD = "ENGENHARIA DE PRODUÇÃO",
    ENEL = "ENGENHARIA ELÉTRICA",
    ENMC = "ENGENHARIA MECÂNICA",
    ENQM = "ENGENHARIA QUÍMICA",
    IAD = "INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS",
    RIN = "RELAÇÕES INTERNACIONAIS",
    SIN = "SISTEMAS DE INFORMAÇÃO"
}

export function toEnum(value: string): COURSE {
    switch(value) {
        case "ADMINISTRAÇÃO":
            return COURSE.ADM;
        case "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS":
            return COURSE.ADS;
        case "ARQUITETURA E URBANISMO":
            return COURSE.ARQ;
        case "CIÊNCIAS DA COMPUTAÇÃO":
            return COURSE.CIC;
        case "DESIGN":
            return COURSE.DSN;
        case "ECONOMIA":
            return COURSE.ECO;
        case "ENGENHARIA CIVIL":
            return COURSE.ENCV;
        case "ENGENHARIA DE ALIMENTOS":
            return COURSE.ENAL;
        case "ENGENHARIA DE COMPUTAÇÃO":
            return COURSE.ENCP;
        case "ENGENHARIA DE CONTROLE E AUTOMAÇÃO":
            return COURSE.ENCA;
        case "ENGENHARIA DE PRODUÇÃO":
            return COURSE.ENPD;
        case "ENGENHARIA ELÉTRICA":
            return COURSE.ENEL;
        case "ENGENHARIA MECÂNICA":
            return COURSE.ENMC;
        case "ENGENHARIA QUÍMICA":
            return COURSE.ENQM;
        case "INTELIGÊNCIA ARTIFICIAL E CIÊNCIA DE DADOS":
            return COURSE.IAD;
        case "RELAÇÕES INTERNACIONAIS":
            return COURSE.RIN;
        case "SISTEMAS DE INFORMAÇÃO":
            return COURSE.SIN;
        
        default:
            throw new Error("Invalid value");
    }
}