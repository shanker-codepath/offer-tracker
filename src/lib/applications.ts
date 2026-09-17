import { prisma } from "@/lib/db";
import { DEFAULT_USER_ID } from "@/lib/constants";
import type { Status } from "@prisma/client";
import type { ApplicationFormInput } from "@/lib/validation";

export type ApplicationListItem = Awaited<ReturnType<typeof getApplications>>[number];

export type ApplicationSort = "date-desc" | "company-asc" | "company-desc";

export interface GetApplicationsOptions {
  status?: Status;
  search?: string;
  sort?: ApplicationSort;
}

const sortOrderBy: Record<ApplicationSort, { createdAt: "desc" } | { company: "asc" | "desc" }> = {
  "date-desc": { createdAt: "desc" },
  "company-asc": { company: "asc" },
  "company-desc": { company: "desc" },
};

export async function getApplications(options: GetApplicationsOptions = {}) {
  const { status, search, sort = "date-desc" } = options;

  const applications = await prisma.application.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      ...(status ? { status } : {}),
    },
    orderBy: sortOrderBy[sort],
  });

  const filtered = search
    ? applications.filter(
        (app) => app.company.includes(search) || app.role.includes(search),
      )
    : applications;

  // NOTE: this issues one extra query per row instead of a single aggregated
  // query — fine at seed-data scale, a real N+1 as the list grows.
  const withEventCounts = await Promise.all(
    filtered.map(async (app) => {
      const eventCount = await prisma.applicationEvent.count({
        where: { applicationId: app.id },
      });
      return { ...app, eventCount };
    }),
  );

  return withEventCounts;
}

export async function getApplication(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "desc" } },
    },
  });
}

function toDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toNullableInt(value: number | undefined): number | null {
  return value === undefined ? null : value;
}

export async function createApplication(input: ApplicationFormInput) {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.create({
      data: {
        company: input.company,
        role: input.role,
        status: input.status,
        jobPostingUrl: input.jobPostingUrl || null,
        location: input.location || null,
        salaryMin: toNullableInt(input.salaryMin),
        salaryMax: toNullableInt(input.salaryMax),
        source: input.source || null,
        appliedDate: toDate(input.appliedDate),
        followUpDate: toDate(input.followUpDate),
        notes: input.notes || null,
        userId: DEFAULT_USER_ID,
      },
    });

    await tx.applicationEvent.create({
      data: {
        applicationId: application.id,
        type: "CREATED",
        toStatus: application.status,
        description: `Application created for ${application.role} at ${application.company}`,
      },
    });

    return application;
  });
}

export async function updateApplication(id: string, input: ApplicationFormInput) {
  const existing = await prisma.application.findUniqueOrThrow({ where: { id } });

  return prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id },
      data: {
        company: input.company,
        role: input.role,
        status: input.status,
        jobPostingUrl: input.jobPostingUrl || null,
        location: input.location || null,
        salaryMin: toNullableInt(input.salaryMin),
        salaryMax: toNullableInt(input.salaryMax),
        source: input.source || null,
        appliedDate: toDate(input.appliedDate),
        followUpDate: toDate(input.followUpDate),
        notes: input.notes || null,
      },
    });

    if (existing.status !== updated.status) {
      await tx.applicationEvent.create({
        data: {
          applicationId: id,
          type: "STATUS_CHANGE",
          fromStatus: existing.status,
          toStatus: updated.status,
        },
      });
    }

    return updated;
  });
}

export async function changeStatus(id: string, newStatus: Status) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.application.findUniqueOrThrow({ where: { id } });

    const updated = await tx.application.update({
      where: { id },
      data: { status: newStatus },
    });

    if (existing.status !== newStatus) {
      await tx.applicationEvent.create({
        data: {
          applicationId: id,
          type: "STATUS_CHANGE",
          fromStatus: existing.status,
          toStatus: newStatus,
        },
      });
    }

    return updated;
  });
}

export async function deleteApplication(id: string) {
  return prisma.application.delete({ where: { id } });
}

export interface DashboardStats {
  totalCount: number;
  countsByStatus: Record<Status, number>;
  recentEvents: Awaited<ReturnType<typeof getRecentEvents>>;
}

async function getRecentEvents() {
  return prisma.applicationEvent.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      application: { select: { id: true, company: true, role: true } },
    },
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [applications, recentEvents] = await Promise.all([
    prisma.application.findMany({
      where: { userId: DEFAULT_USER_ID },
      select: { status: true },
    }),
    getRecentEvents(),
  ]);

  const countsByStatus = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<Status, number>,
  );

  return {
    totalCount: applications.length,
    countsByStatus,
    recentEvents,
  };
}
