import Link from "next/link";
import { expLabel, fmt } from "@/lib/sports";

type Props = {
  id: string;
  name: string;
  sport: string;
  experience: string;
  hourlyRate: number;
  rating: number | null;
  reviewCount: number;
  distanceMi: number;
  zipCode: string;
};

export function CoachCard({
  id,
  name,
  sport,
  experience,
  hourlyRate,
  rating,
  reviewCount,
  distanceMi,
  zipCode,
}: Props) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/coaches/${id}`}
      className="card flex gap-4 hover:border-brand hover:shadow"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-lg">
        {initials || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold truncate">{name}</div>
            <div className="text-sm text-gray-600">
              {sport} · {expLabel(experience)}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold">{fmt(hourlyRate * 100)}/hr</div>
            <div className="text-xs text-gray-500">
              {distanceMi <= 1 ? "<1 mi" : `~${distanceMi} mi`}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          {rating !== null ? (
            <span className="font-medium">
              ★ {rating.toFixed(1)}{" "}
              <span className="text-gray-500 font-normal">({reviewCount})</span>
            </span>
          ) : (
            <span className="text-gray-500">New coach</span>
          )}
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-xs">ZIP {zipCode}</span>
        </div>
      </div>
    </Link>
  );
}
