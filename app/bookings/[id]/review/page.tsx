import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function reviewAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const bookingId = String(formData.get("bookingId") || "");
  const rating = Math.max(1, Math.min(5, parseInt(String(formData.get("rating") || "5"), 10)));
  const comment = String(formData.get("comment") || "").trim().slice(0, 200);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });
  if (!booking) redirect("/dashboard");
  if (booking.playerId !== user.id) redirect("/dashboard");
  if (booking.status !== "COMPLETED") redirect(`/bookings/${bookingId}`);
  if (booking.review) redirect(`/bookings/${bookingId}`);

  await prisma.review.create({
    data: {
      bookingId,
      coachId: booking.coachId,
      authorId: user.id,
      rating,
      comment: comment || null,
    },
  });
  redirect(`/bookings/${bookingId}`);
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      coach: { include: { user: { select: { name: true } } } },
      review: true,
    },
  });
  if (!booking) notFound();
  if (booking.playerId !== user.id) redirect("/dashboard");
  if (booking.review) redirect(`/bookings/${booking.id}`);

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Rate your session</h1>
        <p className="text-sm text-gray-600 mb-5">
          How was your session with {booking.coach.user.name}?
        </p>
        <form action={reviewAction} className="space-y-4">
          <input type="hidden" name="bookingId" value={booking.id} />
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-3 text-center text-lg has-[:checked]:border-brand has-[:checked]:bg-brand/10 has-[:checked]:text-brand has-[:checked]:font-bold"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={n}
                    defaultChecked={n === 5}
                    className="sr-only"
                  />
                  {"★".repeat(n)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Comment (optional, 200 chars)</label>
            <textarea
              className="input min-h-[100px]"
              name="comment"
              maxLength={200}
              placeholder="What did you like? What would help next time?"
            />
          </div>
          <button className="btn-primary w-full" type="submit">
            Submit review
          </button>
        </form>
      </div>
    </div>
  );
}
