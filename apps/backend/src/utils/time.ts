// utils/time.js

export function diffTime(start: string, end: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h! * 60 + m!;
  };

  const diff = toMinutes(end) - toMinutes(start);
  const h = Math.floor(diff / 60).toString().padStart(2, "0");
  const m = (diff % 60).toString().padStart(2, "0");

  return `${h}:${m}`;
}



export const toStartOfDay = (date: Date | string, offsetHours = 0) => {
    const d = new Date(date);
    d.setUTCHours(-offsetHours, 0, 0, 0);
    return d;
};

export const toEndOfDay = (date: Date | string, offsetHours = 0) => {
    const d = new Date(date);
    d.setUTCHours(23 + (-offsetHours), 59, 59, 999);
    return d;
};