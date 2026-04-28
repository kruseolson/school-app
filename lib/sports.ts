export const SPORTS = [
  "Basketball",
  "Soccer",
  "Football",
  "Baseball",
  "Volleyball",
  "Tennis",
  "Swimming",
  "Track & Field",
  "Lacrosse",
  "Hockey",
  "Golf",
  "Wrestling",
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "HS_PLAYER", label: "High School Player" },
  { value: "COLLEGE_PLAYER", label: "College Player" },
  { value: "FORMER_PRO", label: "Former Pro / D1" },
  { value: "CERTIFIED", label: "Certified Coach" },
] as const;

export function expLabel(value: string) {
  return EXPERIENCE_LEVELS.find((e) => e.value === value)?.label ?? value;
}

export const DURATIONS = [
  { min: 30, label: "30 min" },
  { min: 60, label: "1 hour" },
  { min: 90, label: "1.5 hours" },
  { min: 120, label: "2 hours" },
] as const;

export function priceForDuration(hourlyRate: number, durationMin: number) {
  const totalDollars = Math.round((hourlyRate * durationMin) / 60);
  const totalCents = totalDollars * 100;
  const platformCents = Math.round(totalCents * 0.1);
  const coachCents = totalCents - platformCents;
  return { totalCents, platformCents, coachCents };
}

export function fmt(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

// Cheap ZIP-based "distance" for MVP — same first 3 digits = ~5mi, same first 2 = ~25mi.
export function approxDistance(zipA?: string | null, zipB?: string | null) {
  if (!zipA || !zipB) return 999;
  if (zipA === zipB) return 1;
  if (zipA.slice(0, 3) === zipB.slice(0, 3)) return 5;
  if (zipA.slice(0, 2) === zipB.slice(0, 2)) return 25;
  return 100;
}
