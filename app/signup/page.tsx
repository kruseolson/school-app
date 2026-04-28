import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, getCurrentUser } from "@/lib/auth";

async function signupAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "PLAYER");
  const ageRaw = String(formData.get("age") || "");
  const zip = String(formData.get("zipCode") || "").trim();

  if (!email || !password || !name) redirect("/signup?error=missing");
  if (password.length < 6) redirect("/signup?error=short");
  if (!["PLAYER", "COACH", "PARENT"].includes(role)) redirect("/signup?error=role");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/signup?error=exists");

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name,
      role,
      age: ageRaw ? parseInt(ageRaw) : null,
      zipCode: zip || null,
    },
  });
  await createSession(user.id);
  if (role === "COACH") redirect("/coach/setup");
  redirect("/dashboard");
}

const errors: Record<string, string> = {
  missing: "Please fill all required fields.",
  short: "Password must be at least 6 characters.",
  exists: "An account with that email already exists.",
  role: "Pick an account type.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; role?: string };
}) {
  const me = await getCurrentUser();
  if (me) redirect("/dashboard");
  const defaultRole = searchParams.role === "COACH" ? "COACH" : "PLAYER";

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-600 mb-5">
          Join CoachUp to find coaches or start earning as one.
        </p>
        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errors[searchParams.error] ?? "Something went wrong."}
          </div>
        )}
        <form action={signupAction} className="space-y-3">
          <div>
            <label className="label">I am a…</label>
            <div className="grid grid-cols-3 gap-2">
              {["PLAYER", "COACH", "PARENT"].map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-2 py-2 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/10 has-[:checked]:text-brand has-[:checked]:font-semibold"
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    defaultChecked={r === defaultRole}
                    className="sr-only"
                  />
                  {r === "PLAYER" ? "Player" : r === "COACH" ? "Coach" : "Parent"}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Full name</label>
            <input className="input" name="name" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              minLength={6}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Age</label>
              <input className="input" type="number" name="age" min={5} max={99} />
            </div>
            <div>
              <label className="label">ZIP code</label>
              <input className="input" name="zipCode" maxLength={10} />
            </div>
          </div>
          <button className="btn-primary w-full" type="submit">
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Have an account?{" "}
          <Link href="/login" className="text-brand font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
