import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SPORTS, approxDistance } from "@/lib/sports";
import { CoachCard } from "@/components/CoachCard";

type Search = {
  sport?: string;
  radius?: string;
  zip?: string;
  q?: string;
};

export default async function CoachesPage({ searchParams }: { searchParams: Search }) {
  const me = await getCurrentUser();
  const sport = searchParams.sport ?? "";
  const radius = parseInt(searchParams.radius ?? "25", 10);
  const zip = (searchParams.zip ?? me?.zipCode ?? "").trim();
  const q = (searchParams.q ?? "").trim().toLowerCase();

  const profiles = await prisma.coachProfile.findMany({
    where: { ...(sport ? { sport } : {}) },
    include: {
      user: { select: { name: true, zipCode: true } },
      reviews: { select: { rating: true } },
    },
    take: 200,
  });

  const enriched = profiles
    .map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const rating =
        ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      const distanceMi = approxDistance(zip || null, p.zipCode);
      return {
        id: p.id,
        name: p.user.name,
        sport: p.sport,
        experience: p.experience,
        hourlyRate: p.hourlyRate,
        rating,
        reviewCount: ratings.length,
        distanceMi,
        zipCode: p.zipCode,
      };
    })
    .filter((c) => (zip ? c.distanceMi <= radius : true))
    .filter((c) =>
      q
        ? c.name.toLowerCase().includes(q) ||
          c.sport.toLowerCase().includes(q)
        : true
    )
    .sort((a, b) => {
      const ar = a.rating ?? 0;
      const br = b.rating ?? 0;
      if (br !== ar) return br - ar;
      return a.distanceMi - b.distanceMi;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Find a coach</h1>
        <p className="text-sm text-gray-600">
          Browse local coaches by sport and distance.
        </p>
      </div>

      <form className="card grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <label className="label">Sport</label>
          <select className="input" name="sport" defaultValue={sport}>
            <option value="">Any</option>
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">ZIP</label>
          <input className="input" name="zip" defaultValue={zip} placeholder="ZIP" />
        </div>
        <div>
          <label className="label">Within</label>
          <select className="input" name="radius" defaultValue={String(radius)}>
            <option value="5">5 mi</option>
            <option value="10">10 mi</option>
            <option value="25">25 mi</option>
            <option value="100">Any</option>
          </select>
        </div>
        <div>
          <label className="label">Search</label>
          <input className="input" name="q" defaultValue={q} placeholder="Name or sport" />
        </div>
        <div className="sm:col-span-4">
          <button className="btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {enriched.length === 0 ? (
        <div className="card text-center text-gray-600">
          No coaches matched your filters yet. Try widening your radius.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {enriched.map((c) => (
            <CoachCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
