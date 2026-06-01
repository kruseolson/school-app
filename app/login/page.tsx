import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword, getCurrentUser } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect("/login?error=1");
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const me = await getCurrentUser();
  if (me) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-5">Log in to book or coach.</p>
        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Invalid email or password.
          </div>
        )}
        <form action={loginAction} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" name="password" required />
          </div>
          <button className="btn-primary w-full" type="submit">
            Log in
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          New here?{" "}
          <Link href="/signup" className="text-brand font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
