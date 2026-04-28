import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { fmt } from "@/lib/sports";

async function payAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const bookingId = String(formData.get("bookingId") || "");
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.playerId !== user.id) redirect("/dashboard");

  // Mock payment: in real app, call Stripe PaymentIntent here.
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: booking.status === "PENDING" ? "PENDING" : "CONFIRMED" },
  });
  redirect(`/bookings/${bookingId}?paid=1`);
}

export default async function PayPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { coach: { include: { user: { select: { name: true } } } } },
  });
  if (!booking) notFound();
  if (booking.playerId !== user.id) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Payment</h1>
        <p className="text-sm text-gray-600 mb-5">
          Demo checkout — no real card is charged.
        </p>

        <div className="rounded-lg bg-gray-50 p-3 text-sm space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Coach</span>
            <span className="font-medium">{booking.coach.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span>When</span>
            <span className="font-medium">
              {booking.scheduledAt.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium">{booking.durationMin} min</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <span>Session price</span>
            <span>{fmt(booking.totalCents)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Coach earns</span>
            <span>{fmt(booking.coachCents)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Platform fee (10%)</span>
            <span>{fmt(booking.platformCents)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>{fmt(booking.totalCents)}</span>
          </div>
        </div>

        <form action={payAction} className="space-y-3">
          <input type="hidden" name="bookingId" value={booking.id} />
          <div>
            <label className="label">Card number</label>
            <input className="input" defaultValue="4242 4242 4242 4242" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Expiry</label>
              <input className="input" defaultValue="12/29" readOnly />
            </div>
            <div>
              <label className="label">CVC</label>
              <input className="input" defaultValue="123" readOnly />
            </div>
          </div>
          <button className="btn-primary w-full" type="submit">
            Pay {fmt(booking.totalCents)}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Free cancellation up to 24h before. 50% refund within 24h.
          </p>
        </form>
      </div>
    </div>
  );
}
