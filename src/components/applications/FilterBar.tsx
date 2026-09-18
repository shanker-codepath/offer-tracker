import { StatusFilter } from "@/components/applications/StatusFilter";
import { SearchInput } from "@/components/applications/SearchInput";
import { Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Status } from "@prisma/client";

export function FilterBar({
  status,
  search,
  sort,
}: {
  status?: Status | "";
  search?: string;
  sort?: string;
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <div className="min-w-[220px] flex-1">
        <SearchInput defaultValue={search} />
      </div>
      <StatusFilter defaultValue={status} key={status ?? ""} />
      <Select name="sort" defaultValue={sort ?? "date-desc"} aria-label="Sort by">
        <option value="date-desc">Date added (newest)</option>
        <option value="company-asc">Company (A–Z)</option>
        <option value="company-desc">Company (Z–A)</option>
      </Select>
      <Button type="submit" variant="secondary">
        Apply
      </Button>
    </form>
  );
}
