import { getApplications, type ApplicationSort } from "@/lib/applications";
import { FilterBar } from "@/components/applications/FilterBar";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import type { Status } from "@prisma/client";

const VALID_SORTS: ApplicationSort[] = ["date-desc", "company-asc", "company-desc"];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status as Status | undefined) || undefined;
  const search = params.search || undefined;
  const sort = VALID_SORTS.includes(params.sort as ApplicationSort)
    ? (params.sort as ApplicationSort)
    : undefined;

  const applications = await getApplications({ status, search, sort });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
      <FilterBar status={status ?? ""} search={search} sort={sort} />
      <ApplicationTable applications={applications} />
    </div>
  );
}
