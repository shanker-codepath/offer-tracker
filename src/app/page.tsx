import Link from "next/link";
import { getDashboardStats } from "@/lib/applications";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDate } from "@/lib/utils";

// Always reflects the latest data — this page has no user-specific auth to
// vary on, but it does read the database on every request.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {stats.totalCount} {stats.totalCount === 1 ? "Application" : "Applications"}
        </h1>
        <p className="text-slate-500">Here&apos;s where your job search stands today.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <Link
            key={status}
            href={`/applications?status=${status}`}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300"
          >
            <p className="text-2xl font-semibold text-slate-900">
              {stats.countsByStatus[status] ?? 0}
            </p>
            <p className="text-sm text-slate-500">{STATUS_LABELS[status]}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent activity</h2>
        {stats.recentEvents.length === 0 ? (
          <p className="text-sm text-slate-500">
            No activity yet — add your first application to get started.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {stats.recentEvents.map((event) => (
              <li key={event.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link
                    href={`/applications/${event.application.id}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {event.application.company}
                  </Link>
                  <span className="text-slate-500"> — {event.application.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  {event.toStatus && <StatusBadge status={event.toStatus} />}
                  <span className="text-xs text-slate-400">{formatDate(event.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
