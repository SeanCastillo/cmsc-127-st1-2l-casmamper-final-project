import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "LTOIMS",
  description: "LTO Information Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b-4 border-yellow-500 bg-blue-950 text-white shadow">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-wide">
              LTOIMS
            </Link>

            {/* main navigation links */}
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/drivers" className="rounded px-3 py-2 hover:bg-blue-900">
                Drivers
              </Link>
              <Link href="/vehicles" className="rounded px-3 py-2 hover:bg-blue-900">
                Vehicles
              </Link>
              <Link
                href="/registrations"
                className="rounded px-3 py-2 hover:bg-blue-900"
              >
                Registrations
              </Link>
              <Link
                href="/violations"
                className="rounded px-3 py-2 hover:bg-blue-900"
              >
                Violations
              </Link>
              <Link href="/reports" className="rounded px-3 py-2 hover:bg-blue-900">
                Reports
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
