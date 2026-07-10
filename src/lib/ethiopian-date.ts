/**
 * Ethiopian calendar (Amete Mihret) conversion.
 * Standard JDN-based algorithm (Beyene & Kudlek).
 */

const JD_EPOCH_OFFSET = 1723856; // Amete Mihret epoch

const ETHIOPIAN_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜን",
];

function gregorianToJDN(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function toEthiopian(date: Date): { year: number; month: number; day: number } {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const r = (jdn - JD_EPOCH_OFFSET) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year =
    4 * Math.floor((jdn - JD_EPOCH_OFFSET) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

/** e.g. "ሐምሌ 3፣ 2018 ዓ.ም." */
export function formatEthiopianDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const et = toEthiopian(d);
  return `${ETHIOPIAN_MONTHS[et.month - 1]} ${et.day}፣ ${et.year} ዓ.ም.`;
}

/** e.g. "ሐምሌ 3፣ 10:30" (time stays in the Gregorian clock) */
export function formatEthiopianDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const et = toEthiopian(d);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
  return `${ETHIOPIAN_MONTHS[et.month - 1]} ${et.day}፣ ${time}`;
}
