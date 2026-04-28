import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { fmt } from "@/lib/sports";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const coachProfile = await prisma.coachProfile.findUnique({
    where: { userId: user.id },
  });

  const playerBookings = await prisma.booking.findMany({
    where: { playerId: user.id },
    include: { coach: { include: { user: { select: { name: true } } } } },
    orderBy: { scheduledAt: "desc" },
    take: 20,
  });

  const coachBookings = coachProfile
    ? await prisma.booking.findMany({
        where: { coachId: coachProfile.id },
        include: { player: { select: { name: true } } },
        orderBy: { scheduledAt: "desc" },
        take: 20,
      })
    : [];

  const completedEarnings = coachProfile
    ? await prisma.booking.aggregate({
        where: { coachId: coachProfile.id, status: "COMPLETED" },
        _sum: { coachCents: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-gray-600">
          {user.role === "COACH"
            ? "Manage your sessions and earnings."
            : "Find coaches and track your bookings."}
        </p>
      </div>

      {coachProfile ? (
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Coach overview</h2>
            <Link href="/coach/setup" className="text-sm text-brand font-semibold">
              Edit profile
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <Stat label="Sport" value={coachProfile.sport} />
            <Stat label="Hourly rate" value={`${fmt(coachProfile.hourlyRate * 100)}/hr`} />
            <Stat
              label="Lifetime earnings"
              value={fmt(completedEarnings?._sum.coachCents ?? 0)}
            />
          </div>
        </section>
      ) : user.role === "COACH" ? (
        <section className="card">
          <h2 className="font-semibold mb-2">Finish your coach profile</h2>
          <p className="text-sm text-gray-600 mb-3">
            You need a profile before players can book you.
          </p>
          <Link href="/coach/setup" className="btn-primary">
            Set up profile
          </Link>
        </section>
      ) : (
        <section className="card">
          <h2 className="font-semibold mb-2">Want to coach?</h2>
          <p className="text-sm text-gray-600 mb-3">
            Earn money on your schedule. Set your rate and availability.
          </p>
          <Link href="/coach/setup" className="btn-secondary">
            Become a coach
          </Link>
        </section>
      )}

      {coachProfile && (
        <section>
          <h2 className="font-semibold mb-2">Bookings as coach</h2>
          <BookingList
            items={coachBookings.map((b) => ({
              id: b.id,
              other: b.player.name,
              when: b.scheduledAt,
              durationMin: b.durationMin,
              total: b.coachCents,
              status: b.status,
              role: "coach",
            }))}
          />
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-2">Your bookings</h2>
        <BookingList
          items={playerBookings.map((b) => ({
            id: b.id,
            other: b.coach.user.name,
            when: b.scheduledAt,
            durationMin: b.durationMin,
            total: b.totalCents,
            status: b.status,
            role: "player",
          }))}
          emptyHint={
            <Link href="/coaches" className="btn-primary mt-3 inline-flex">
              Browse coaches
            </Link>
          }
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

type Item = {
  id: string;
  other: string;
  when: Date;
  durationMin: number;
  total: number;
  status: string;
  role: "player" | "coach";
};

function BookingList({
  items,
  emptyHint,
}: {
  items: Item[];
  emptyHint?: React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <div className="card text-sm text-gray-500">
        No bookings yet.
        {emptyHint}
      </div>
    );
  }
  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-gray-200 text-gray-700",
  };
  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b.id}>
          <Link
            href={`/bookings/${b.id}`}
            className="card flex items-center justify-between hover:border-brand"
          >
            <div>
              <div className="font-medium">
                {b.role === "player" ? "with " : ""}
                {b.other}
              </div>
              <div className="text-xs text-gray-500">
                {b.when.toLocaleString()} · {b.durationMin} min
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{fmt(b.total)}</div>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  statusColor[b.status]
                }`}
              >
                {b.status}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
