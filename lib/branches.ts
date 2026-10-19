/**
 * Branches, cross-verified on 2026-10-18: names and phone numbers from the latest
 * Instagram captions (Oct 2026); addresses, hours, coordinates and ratings from each
 * branch's Google Maps listing. See research/research.md.
 */
export type Hours = { open: number; close: number }; // minutes from midnight; close may exceed 1440

export type Branch = {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  /** Index 0 = Monday. */
  hours: Hours[];
  rating: number;
  reviews: number;
  mapsUrl: string;
  note?: string;
};

function toMin(t: string, isClose = false) {
  const [hh, mm = "0"] = t.split(":");
  let m = Number(hh) * 60 + Number(mm);
  if (isClose && m <= 12 * 60) m += 24 * 60; // closes after midnight
  return m;
}
const h = (open: string, close: string): Hours => ({ open: toMin(open), close: toMin(close, true) });
const daily = (x: Hours) => Array.from({ length: 7 }, () => x);
const maps = (q: string, id: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&query_place_id=${id}`;

export const BRANCHES: Branch[] = [
  {
    id: "model-town",
    name: "Model Town",
    area: "Bank Square Market",
    address: "Shop 169-C, Bank Square Market, Model Town, Lahore",
    phone: "0311 1104464",
    lat: 31.4887736,
    lng: 74.3256906,
    hours: [...Array.from({ length: 6 }, () => h("11", "1:30")), h("12", "1:30")],
    rating: 4.1,
    reviews: 31,
    mapsUrl: maps("Health n Goodness Model Town", "ChIJWW7HKBIEGTkRfOrkAo3x2W4"),
    note: "Fruit baskets ship from this branch",
  },
  {
    id: "gulberg",
    name: "Gulberg",
    area: "MM Alam Road",
    address: "MM Alam Road, Block B3, Gulberg III, Lahore",
    phone: "0323 4883307",
    lat: 31.5068232,
    lng: 74.3500282,
    hours: daily(h("14", "4")),
    rating: 4.3,
    reviews: 128,
    mapsUrl: maps("HnG MM Alam Road", "ChIJITLGyk8EGTkRvaKlYfQx0ds"),
  },
  {
    id: "dha-1",
    name: "DHA Phase 1",
    area: "H Block",
    address: "Street 147, Sector H, DHA Phase 1, Lahore",
    phone: "0343 4868963",
    lat: 31.4817843,
    lng: 74.3955061,
    hours: [h("9", "0:30"), h("9", "0"), h("9", "0"), h("9", "1"), h("9", "1"), h("9", "1"), h("9", "1")],
    rating: 3.9,
    reviews: 25,
    mapsUrl: maps("Health & Goodness DHA Phase 1", "ChIJ2ebdFP0FGTkR9xM0xOqb_6M"),
  },
  {
    id: "dha-2",
    name: "DHA Phase 2",
    area: "Lalik Chowk",
    address: "Civic Commercial Area, Sector T, DHA Phase 2, Lahore",
    phone: "0344 8444959",
    lat: 31.4744574,
    lng: 74.4021056,
    hours: daily(h("15", "3")),
    rating: 4.3,
    reviews: 171,
    mapsUrl: maps("Health & Goodness DHA Phase 2", "ChIJy973yAMGGTkRjV6NsItkvVw"),
  },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function formatTime(min: number) {
  const m = ((min % 1440) + 1440) % 1440;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  if (hh === 0 && mm === 0) return "12 AM";
  const suffix = hh < 12 ? "AM" : "PM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${suffix}`;
}

export const formatHours = (x: Hours) => `${formatTime(x.open)} to ${formatTime(x.close)}`;

/** Lahore local time (Asia/Karachi, fixed UTC+5) as { day: 0=Mon, minutes }. */
export function lahoreNow(date = new Date()) {
  const t = new Date(date.getTime() + 5 * 60 * 60 * 1000);
  return { day: (t.getUTCDay() + 6) % 7, minutes: t.getUTCHours() * 60 + t.getUTCMinutes() };
}

export type OpenState = { open: true; until: number } | { open: false; opensAt: number };

/** Open right now? Checks today's window and yesterday's after-midnight tail. */
export function openState(b: Branch, date = new Date()): OpenState {
  const { day, minutes } = lahoreNow(date);
  const today = b.hours[day];
  const yesterday = b.hours[(day + 6) % 7];
  if (minutes < yesterday.close - 1440) return { open: true, until: yesterday.close };
  if (minutes >= today.open && minutes < today.close) return { open: true, until: today.close };
  return { open: false, opensAt: minutes < today.open ? today.open : b.hours[(day + 1) % 7].open };
}

/** Compact weekly hours: groups identical consecutive days. */
export function hoursSummary(b: Branch) {
  const groups: { from: number; to: number; hours: Hours }[] = [];
  b.hours.forEach((x, i) => {
    const last = groups.at(-1);
    if (last && last.hours.open === x.open && last.hours.close === x.close) last.to = i;
    else groups.push({ from: i, to: i, hours: x });
  });
  return groups.map((g) => ({
    days: g.from === 0 && g.to === 6 ? "Every day" : g.from === g.to ? DAYS[g.from] : `${DAYS[g.from]}-${DAYS[g.to]}`,
    time: formatHours(g.hours),
  }));
}

export const PREFERRED_BRANCH_KEY = "hng-branch";
