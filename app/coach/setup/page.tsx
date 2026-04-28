import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SPORTS, EXPERIENCE_LEVELS } from "@/lib/sports";

async function setupAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sport = String(formData.get("sport") || "");
  const experience = String(formData.get("experience") || "");
  const hourlyRate = parseInt(String(formData.get("hourlyRate") || "0"), 10);
  const bio = String(formData.get("bio") || "").trim();
  const zipCode = String(formData.get("zipCode") || "").trim();
  const serviceRadius = parseInt(String(formData.get("serviceRadius") || "10"), 10);
  const instantBook = formData.get("instantBook") === "on";

  if (!sport || !experience || hourlyRate < 5 || !bio || !zipCode) {
    redirect("/coach/setup?error=1");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "COACH", zipCode },
  });

  await prisma.coachProfile.upsert({
    where: { userId: user.id },
    update: { sport, experience, hourlyRate, bio, zipCode, serviceRadius, instantBook },
    create: {
      userId: user.id,
      sport,
      experience,
      hourlyRate,
      bio,
      zipCode,
      serviceRadius,
      instantBook,
    },
  });

  redirect("/dashboard");
}

export default async function CoachSetupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const existing = await prisma.coachProfile.findUnique({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Set up your coach profile</h1>
        <p className="text-sm text-gray-600 mb-5">
          Takes under 5 minutes. You can edit anytime.
        </p>
        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Please complete all required fields (rate $5+).
          </div>
        )}
        <form action={setupAction} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Sport</label>
              <select className="input" name="sport" defaultValue={existing?.sport ?? ""} required>
                <option value="" disabled>
                  Select a sport
                </option>
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Experience level</label>
              <select
                className="input"
                name="experience"
                defaultValue={existing?.experience ?? ""}
                required
              >
                <option value="" disabled>
                  Select level
                </option>
                {EXPERIENCE_LEVELS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">Hourly rate ($)</label>
              <input
                className="input"
                type="number"
                name="hourlyRate"
                min={5}
                max={500}
                defaultValue={existing?.hourlyRate ?? 35}
                required
              />
            </div>
            <div>
              <label className="label">ZIP code</label>
              <input
                className="input"
                name="zipCode"
                defaultValue={existing?.zipCode ?? user.zipCode ?? ""}
                required
              />
            </div>
            <div>
              <label className="label">Service radius (mi)</label>
              <select
                className="input"
                name="serviceRadius"
                defaultValue={existing?.serviceRadius ?? 10}
              >
                {[5, 10, 25, 50].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Bio / coaching philosophy</label>
            <textarea
              className="input min-h-[120px]"
              name="bio"
              maxLength={1000}
              defaultValue={existing?.bio ?? ""}
              placeholder="Share your background, what you love coaching, and what players can expect…"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="instantBook"
              defaultChecked={existing?.instantBook ?? false}
            />
            Enable instant booking (auto-confirm requests)
          </label>
          <button className="btn-primary w-full" type="submit">
            Save profile
          </button>
        </form>
      </div>
    </div>
  );
}
