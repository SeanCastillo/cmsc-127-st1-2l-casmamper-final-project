import Link from "next/link";

export default function HomePage() {
  const modules = [
    {
      title: "Drivers",
      href: "/drivers",
      description: "View driver records and license information",
    },
    {
      title: "Vehicles",
      href: "/vehicles",
      description: "View registered vehicle details and ownership",
    },
    {
      title: "Registrations",
      href: "/registrations",
      description: "View vehicle registration and renewal records",
    },
    {
      title: "Violations",
      href: "/violations",
      description: "View traffic violation records and statuses",
    },
    {
      title: "Reports",
      href: "/reports",
      description: "Generate required SQL-based reports",
    },
  ];

  return (
    <div>
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-yellow-600">
          Land Transportation Office
        </p>

        <h1 className="mb-3 text-3xl font-bold text-blue-950">
          LTO Information Management System
        </h1>

        <p className="max-w-3xl text-slate-600">
          A database system for managing drivers, vehicles, registrations,
          traffic violations, and official SQL-based reports.
        </p>
      </section>

      {/* quick access cards for main system modules */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-yellow-500 hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-blue-950">
              {module.title}
            </h2>
            <p className="text-sm text-slate-600">{module.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
