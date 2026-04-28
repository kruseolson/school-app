import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { fmt } from "@/lib/sports";

async function updateStatus(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = String(formData.get("bookingId") || "");
  const action = String(formData.get("action") || "");
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { coach: true },
  });
  if (!booking) return;

  const isCoach = booking.coach.userId === user.id;
  const isPlayer = booking.playerId === user.id;
  if (!isCoach && !isPlayer) return;

  const next: Record<string, string> = {
    accept: "CONFIRMED",
    decline: "CANCELLED",
    cancel: "CANCELLED",
    complete: "COMPLETED",
  };
  const target = next[action];
  if (!target) return;

  if (action === "accept" || action === "decline") {
    if (!isCoach) return;
  }
  if (action === "complete") {
    if (!isCoach) return;
    if (booking.status !== "CONFIRMED") return;
  }

  await prisma.booking.update({ where: { id }, data: { status: target } });
  redirect(`/bookings/${id}`);
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { paid?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      coach: { include: { user: { select: { id: true, name: true } } } },
      player: { select: { id: true, name: true } },
      review: true,
    },
  });
  if (!booking) notFound();

  const isCoach = booking.coach.userId === user.id;
  const isPlayer = booking.playerId === user.id;
  if (!isCoach && !isPlayer) redirect("/dashboard");

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {searchParams.paid && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          ✓ Payment received. {booking.status === "PENDING"
            ? "Waiting for coach to confirm."
            : "Your session is confirmed!"}
        </div>
      )}
      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Session details</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusColor[booking.status]
            }`}
          >
            {booking.status}
          </span>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Coach" value={booking.coach.user.name} />
          <Row label="Player" value={booking.player.name} />
          <Row label="When" value={booking.scheduledAt.toLocaleString()} />
          <Row label="Duration" value={`${booking.durationMin} min`} />
          <Row label="Location" value={booking.location} />
          {booking.notes && <Row label="Notes" value={booking.notes} />}
          <Row label="Total paid" value={fmt(booking.totalCents)} />
          {isCoach && (
            <Row label="You earn" value={fmt(booking.coachCents)} />
          )}
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        {isCoach && booking.status === "PENDING" && (
          <>
            <form action={updateStatus}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="action" value="accept" />
              <button className="btn-primary" type="submit">
                Accept
              </button>
            </form>
            <form action={updateStatus}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="action" value="decline" />
              <button className="btn-secondary" type="submit">
                Decline
              </button>
            </form>
          </>
        )}
        {isCoach && booking.status === "CONFIRMED" && (
          <form action={updateStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="action" value="complete" />
            <button className="btn-primary" type="submit">
              Mark complete
            </button>
          </form>
        )}
        {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <form action={updateStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="action" value="cancel" />
            <button className="btn-secondary" type="submit">
              Cancel
            </button>
          </form>
        )}
        {isPlayer && booking.status === "COMPLETED" && !booking.review && (
          <Link href={`/bookings/${booking.id}/review`} className="btn-primary">
            Leave review
          </Link>
        )}
      </div>

      {booking.review && (
        <div className="card">
          <h2 className="font-semibold mb-1">Your review</h2>
          <div className="text-sm">★ {booking.review.rating}</div>
          {booking.review.comment && (
            <p className="text-sm text-gray-700 mt-1">{booking.review.comment}</p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
