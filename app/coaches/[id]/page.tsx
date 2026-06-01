import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DURATIONS, expLabel, fmt, priceForDuration } from "@/lib/sports";

export default async function CoachDetailPage({ params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  const coach = await prisma.coachProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, age: true } },
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
  if (!coach) notFound();

  const ratings = coach.reviews.map((r) => r.rating);
  const avg =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  const initials = coach.user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isOwner = me?.id === coach.userId;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="sm:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xl">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{coach.user.name}</h1>
              <p className="text-sm text-gray-600">
                {coach.sport} · {expLabel(coach.experience)}
              </p>
              <div className="mt-1 text-sm">
                {avg !== null ? (
                  <span className="font-medium">
                    ★ {avg.toFixed(1)}{" "}
                    <span className="text-gray-500 font-normal">
                      ({ratings.length} reviews)
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">No reviews yet</span>
                )}
                <span className="text-gray-400"> · </span>
                <span className="text-gray-600">ZIP {coach.zipCode}</span>
                {coach.instantBook && (
                  <span className="ml-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Instant book
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold mb-1">About</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{coach.bio}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Reviews</h2>
          {coach.reviews.length === 0 ? (
            <p className="text-sm text-gray-500">
              No reviews yet — be the first to book!
            </p>
          ) : (
            <ul className="space-y-3">
              {coach.reviews.map((r) => (
                <li key={r.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.author.name}</div>
                    <div className="text-sm">★ {r.rating}</div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-700 mt-1">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="space-y-3">
        <div className="card">
          <div className="text-sm text-gray-500">Hourly rate</div>
          <div className="text-3xl font-extrabold">{fmt(coach.hourlyRate * 100)}</div>
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            {DURATIONS.map((d) => {
              const { totalCents } = priceForDuration(coach.hourlyRate, d.min);
              return (
                <li key={d.min} className="flex justify-between">
                  <span>{d.label}</span>
                  <span className="font-medium">{fmt(totalCents)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            {isOwner ? (
              <Link href="/coach/setup" className="btn-secondary w-full">
                Edit profile
              </Link>
            ) : me ? (
              <Link href={`/coaches/${coach.id}/book`} className="btn-primary w-full">
                Book a session
              </Link>
            ) : (
              <Link href="/login" className="btn-primary w-full">
                Log in to book
              </Link>
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Cancel free up to 24h before. 10% platform fee included.
          </p>
        </div>
      </aside>
    </div>
  );
}
