// utils/time.js
export function diffTime(start, end) {
    const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };
    const diff = toMinutes(end) - toMinutes(start);
    const h = Math.floor(diff / 60).toString().padStart(2, "0");
    const m = (diff % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
}
export const toStartOfDay = (date, offsetHours = 0) => {
    const d = new Date(date);
    d.setUTCHours(-offsetHours, 0, 0, 0);
    return d;
};
export const toEndOfDay = (date, offsetHours = 0) => {
    const d = new Date(date);
    d.setUTCHours(23 + (-offsetHours), 59, 59, 999);
    return d;
};
//# sourceMappingURL=time.js.map