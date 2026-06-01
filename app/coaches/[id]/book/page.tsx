import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DURATIONS, fmt, priceForDuration } from "@/lib/sports";

async function bookAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const coachId = String(formData.get("coachId") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const durationMin = parseInt(String(formData.get("durationMin") || "60"), 10);
  const location = String(formData.get("location") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  const coach = await prisma.coachProfile.findUnique({ where: { id: coachId } });
  if (!coach) redirect("/coaches");
  if (coach.userId === user.id) redirect("/coaches");

  const scheduledAt = new Date(`${date}T${time}:00`);
  if (isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
    redirect(`/coaches/${coachId}/book?error=time`);
  }
  if (![30, 60, 90, 120].includes(durationMin)) {
    redirect(`/coaches/${coachId}/book?error=duration`);
  }
  if (!location) {
    redirect(`/coaches/${coachId}/book?error=location`);
  }

  const { totalCents, coachCents, platformCents } = priceForDuration(
    coach.hourlyRate,
    durationMin
  );

  const booking = await prisma.booking.create({
    data: {
      coachId,
      playerId: user.id,
      scheduledAt,
      durationMin,
      totalCents,
      coachCents,
      platformCents,
      location,
      notes: notes || null,
      status: coach.instantBook ? "CONFIRMED" : "PENDING",
    },
  });
  redirect(`/bookings/${booking.id}/pay`);
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const coach = await prisma.coachProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } } },
  });
  if (!coach) notFound();

  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);

  const errors: Record<string, string> = {
    time: "Pick a valid future date and time.",
    duration: "Pick a valid duration.",
    location: "Where will the session happen?",
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Book {coach.user.name}</h1>
        <p className="text-sm text-gray-600 mb-5">
          {coach.sport} · {fmt(coach.hourlyRate * 100)}/hr
        </p>
        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errors[searchParams.error] ?? "Please review your details."}
          </div>
        )}
        <form action={bookAction} className="space-y-4">
          <input type="hidden" name="coachId" value={coach.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" name="date" min={minDate} required />
            </div>
            <div>
              <label className="label">Time</label>
              <input className="input" type="time" name="time" required />
            </div>
          </div>
          <div>
            <label className="label">Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d, i) => {
                const { totalCents } = priceForDuration(coach.hourlyRate, d.min);
                return (
                  <label
                    key={d.min}
                    className="cursor-pointer rounded-lg border border-gray-300 px-2 py-3 text-center text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/10 has-[:checked]:text-brand has-[:checked]:font-semibold"
                  >
                    <input
                      type="radio"
                      name="durationMin"
                      value={d.min}
                      defaultChecked={i === 1}
                      className="sr-only"
                    />
                    <div>{d.label}</div>
                    <div className="text-xs text-gray-500 has-[:checked]:text-brand">
                      {fmt(totalCents)}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className="input"
              name="location"
              placeholder="e.g. Lincoln Park courts, my driveway, virtual"
              required
            />
          </div>
          <div>
            <label className="label">Notes for coach (optional)</label>
            <textarea
              className="input min-h-[80px]"
              name="notes"
              maxLength={500}
              placeholder="Skills you want to work on, equipment, etc."
            />
          </div>
          <button className="btn-primary w-full" type="submit">
            Continue to payment
          </button>
        </form>
      </div>
    </div>
  );
}
