import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SPORTS } from "@/lib/sports";

export default async function HomePage() {
  const coachCount = await prisma.coachProfile.count();
  const sessionsCount = await prisma.booking.count({ where: { status: "COMPLETED" } });

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-8 text-white sm:p-12">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Find your coach.
          <br />
          Up your game.
        </h1>
        <p className="mt-4 max-w-xl text-white/90">
          Book affordable, local 1-on-1 coaching with high school and college athletes.
          Get better, on your schedule, in your neighborhood.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/coaches" className="btn bg-white text-brand hover:bg-gray-100">
            Browse coaches
          </Link>
          <Link
            href="/signup?role=COACH"
            className="btn border border-white/40 text-white hover:bg-white/10"
          >
            Become a coach
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/80">
          {coachCount} coaches available · {sessionsCount} sessions booked
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Popular sports</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPORTS.slice(0, 8).map((s) => (
            <Link
              key={s}
              href={`/coaches?sport=${encodeURIComponent(s)}`}
              className="card text-center hover:border-brand hover:shadow"
            >
              <div className="font-semibold">{s}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="text-2xl">🏀</div>
          <h3 className="mt-2 font-bold">Local & affordable</h3>
          <p className="text-sm text-gray-600 mt-1">
            20–40% cheaper than pro coaching, with athletes from your community.
          </p>
        </div>
        <div className="card">
          <div className="text-2xl">⭐</div>
          <h3 className="mt-2 font-bold">Verified ratings</h3>
          <p className="text-sm text-gray-600 mt-1">
            Real reviews from real players. Top coaches rise to the top.
          </p>
        </div>
        <div className="card">
          <div className="text-2xl">📅</div>
          <h3 className="mt-2 font-bold">Book on your schedule</h3>
          <p className="text-sm text-gray-600 mt-1">
            30-min, 1-hour, or 2-hour sessions. Book today, train tomorrow.
          </p>
        </div>
      </section>
    </div>
  );
}
