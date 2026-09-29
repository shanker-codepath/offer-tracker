import Link from "next/link";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { StatusSelect } from "@/components/applications/StatusSelect";
import { formatDate } from "@/lib/utils";
import type { ApplicationListItem } from "@/lib/applications";

export function ApplicationTable({
  applications,
  hasFilters = false,
}: {
  applications: ApplicationListItem[];
  hasFilters?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Updates</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.length === 0 && hasFilters && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center">
                <p className="font-medium text-slate-900">
                  No applications match your filters
                </p>
                <p className="mt-2 text-slate-500">
                  Try a different search or clear your filters to see all applications.
                </p>
                <Link
                  href="/applications"
                  className="mt-4 inline-block font-medium text-blue-600 hover:underline"
                >
                  Clear filters
                </Link>
              </td>
            </tr>
          )}
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link href={`/applications/${app.id}`} className="hover:underline">
                  {app.company}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{app.role}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.status} />
                  <StatusSelect id={app.id} status={app.status} />
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(app.appliedDate)}</td>
              <td className="px-4 py-3 text-slate-600">{app.location ?? "—"}</td>
              <td className="px-4 py-3 text-slate-500">{app.eventCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
