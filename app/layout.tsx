import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CoachUp — Find your sports coach",
  description:
    "Book affordable, local coaching sessions with high school and college athletes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff5a1f",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold">
                C
              </span>
              <span className="font-bold text-lg">CoachUp</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/coaches" className="px-3 py-2 text-gray-700 hover:text-brand">
                Browse
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-gray-700 hover:text-brand">
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="btn-secondary" type="submit">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-gray-700 hover:text-brand">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-gray-500">
          CoachUp — affordable youth sports coaching. Demo build.
        </footer>
      </body>
    </html>
  );
}
