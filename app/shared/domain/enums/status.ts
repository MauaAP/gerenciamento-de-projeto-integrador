export enum STATUS {
    SCHEDULED = "SCHEDULED",
    REVIEWING = "REVIEWING",
    COMPLETED = "COMPLETED",
}

export function toStatusEnum(value: string): STATUS {
    switch (value) {
        case "SCHEDULED":
            return STATUS.SCHEDULED;
        case "REVIEWING":
            return STATUS.REVIEWING;
        case "COMPLETED":
            return STATUS.COMPLETED;
        default:
            throw new Error("Invalid value");
    }
}