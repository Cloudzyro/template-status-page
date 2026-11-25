import { groups, incidents, maintenance, site, type ComponentId, type Impact, type Incident } from "../data/status";

const DAY = 86_400_000;
export const now = new Date(site.updatedAt);
const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

export type DayState = "ok" | "minor" | "major" | "maintenance";
export type Day = { date: string; state: DayState; downMinutes: number; titles: string[] };

const rank: Record<DayState, number> = { ok: 0, maintenance: 1, minor: 2, major: 3 };

export const isOpen = (i: Incident) => !i.resolvedAt || new Date(i.resolvedAt) > now;
const end = (i: Incident) => (i.resolvedAt ? Math.min(+new Date(i.resolvedAt), +now) : +now);

export const sortedIncidents = [...incidents].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
export const openIncidents = sortedIncidents.filter((i) => isOpen(i) && i.impact !== "maintenance");
export const upcomingMaintenance = [...maintenance, ...incidents.filter((i) => i.impact === "maintenance" && isOpen(i))]
  .filter((m) => new Date(m.resolvedAt ?? m.startedAt) > now)
  .sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt));

export function daysFor(id: ComponentId): Day[] {
  const out: Day[] = [];
  for (let n = site.days - 1; n >= 0; n--) {
    const start = todayStart - n * DAY;
    const stop = Math.min(start + DAY, +now);
    const day: Day = { date: new Date(start).toISOString().slice(0, 10), state: "ok", downMinutes: 0, titles: [] };
    for (const inc of incidents) {
      if (!inc.components.includes(id)) continue;
      const s = Math.max(+new Date(inc.startedAt), start);
      const e = Math.min(end(inc), stop);
      if (e <= s) continue;
      const state: DayState = inc.impact;
      if (rank[state] > rank[day.state]) day.state = state;
      if (inc.impact === "major") day.downMinutes += Math.round((e - s) / 60_000);
      day.titles.push(inc.title);
    }
    out.push(day);
  }
  return out;
}

export function uptime(days: Day[]) {
  const total = (site.days - 1) * 1440 + (+now - todayStart) / 60_000;
  const down = days.reduce((sum, d) => sum + d.downMinutes, 0);
  return ((1 - down / total) * 100).toFixed(2);
}

export type Current = "operational" | "degraded" | "outage" | "maintenance";
export const currentLabel: Record<Current, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  outage: "Major outage",
  maintenance: "Under maintenance",
};

export function currentFor(id: ComponentId): Current {
  const live = incidents.filter((i) => i.components.includes(id) && isOpen(i) && new Date(i.startedAt) <= now);
  if (live.some((i) => i.impact === "major")) return "outage";
  if (live.some((i) => i.impact === "minor")) return "degraded";
  if (live.some((i) => i.impact === "maintenance")) return "maintenance";
  return "operational";
}

export function overall() {
  const states = groups.flatMap((g) => g.components.map((c) => currentFor(c.id)));
  if (states.includes("outage")) return { state: "outage" as const, text: "Some systems are down" };
  if (states.includes("degraded")) return { state: "degraded" as const, text: "Some systems are running slowly" };
  if (states.includes("maintenance")) return { state: "maintenance" as const, text: "Maintenance in progress" };
  return { state: "operational" as const, text: "All systems operational" };
}

export const componentName = (id: ComponentId) =>
  groups.flatMap((g) => g.components).find((c) => c.id === id)?.name ?? id;

export const impactLabel: Record<Impact, string> = {
  minor: "Minor",
  major: "Major",
  maintenance: "Maintenance",
};

const pad = (n: number) => String(n).padStart(2, "0");
export const utcTime = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
};
export const utcDate = (iso: string, withYear = false) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function duration(i: Incident) {
  const mins = Math.round((end(i) - +new Date(i.startedAt)) / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const phaseLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);
