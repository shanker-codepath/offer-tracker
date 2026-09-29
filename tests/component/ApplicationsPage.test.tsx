// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ApplicationsPage from "@/app/applications/page";
import { FilterBar } from "@/components/applications/FilterBar";
import { getApplications, type ApplicationListItem } from "@/lib/applications";

vi.mock("@/lib/applications", () => ({ getApplications: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

beforeEach(() => vi.mocked(getApplications).mockResolvedValue([]));

describe("Applications empty state", () => {
  it.each([
    { search: "no-such-company" },
    { status: "OFFER" },
    { search: "no-such-company", status: "OFFER" },
    { search: "   " },
  ])("offers to clear filters when no results match %j", async (params) => {
    render(await ApplicationsPage({ searchParams: Promise.resolve(params) }));
    expect(screen.getByText("No applications match your filters")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clear filters" })).toHaveAttribute("href", "/applications");
    expect(screen.getByText("No applications match your filters").closest("td")).toHaveAttribute("colspan", "6");
  });

  it("does not suggest clearing filters when none are active", async () => {
    render(await ApplicationsPage({ searchParams: Promise.resolve({ sort: "company-asc" }) }));
    expect(screen.queryByText("No applications match your filters")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Clear filters" })).not.toBeInTheDocument();
  });

  it("keeps matching application rows visible", async () => {
    const application: ApplicationListItem = {
      id: "test-application", company: "Example Co", role: "Engineer", status: "APPLIED",
      jobPostingUrl: null, location: null, salaryMin: null, salaryMax: null,
      source: null, appliedDate: null, followUpDate: null, notes: null,
      createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-01"),
      userId: "test-user", eventCount: 0,
    };
    vi.mocked(getApplications).mockResolvedValue([application]);
    render(await ApplicationsPage({ searchParams: Promise.resolve({ search: "Example" }) }));
    expect(screen.getByRole("link", { name: "Example Co" })).toHaveAttribute("href", "/applications/test-application");
    expect(screen.queryByRole("link", { name: "Clear filters" })).not.toBeInTheDocument();
  });

  it("resets visible controls when navigation clears the query parameters", () => {
    const { rerender } = render(<FilterBar search="no-match" status="OFFER" sort="company-asc" />);
    expect(screen.getByRole("searchbox")).toHaveValue("no-match");
    expect(screen.getByRole("combobox", { name: "Filter by status" })).toHaveValue("OFFER");
    rerender(<FilterBar />);
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Filter by status" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue("date-desc");
  });
});
