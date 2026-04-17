export const parseNumber = (value) => {
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};
export const parseBoolean = (value) => {
    if (typeof value === "string") {
        const normalized = value.toLowerCase();
        if (normalized === "true")
            return true;
        if (normalized === "false")
            return false;
    }
    return undefined;
};
export const parseDate = (value) => {
    if (typeof value === "string" && value.trim() !== "") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
};
export const parseString = (value) => {
    if (typeof value === "string" && value.trim() !== "")
        return value.trim();
    return undefined;
};
//# sourceMappingURL=controller.utils.js.map