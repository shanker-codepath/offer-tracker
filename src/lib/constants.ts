import type { Status } from "@prisma/client";

// No auth in the MVP — every application belongs to this single seeded demo user.
// Swapping this out for real per-session users is a good advanced issue.
export const DEFAULT_USER_ID = "demo-user";
export const DEFAULT_USER_EMAIL = "demo@offertracker.dev";

export const STATUS_ORDER: Status[] = [
  "WISHLIST",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export const STATUS_LABELS: Record<Status, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const DEFAULT_STATUS_COLOR = "bg-gray-100 text-gray-700 border-gray-200";

export const STATUS_COLORS: Partial<Record<Status, string>> = {
  WISHLIST: "bg-slate-100 text-slate-700 border-slate-200",
  APPLIED: "bg-blue-100 text-blue-700 border-blue-200",
  PHONE_SCREEN: "bg-purple-100 text-purple-700 border-purple-200",
  INTERVIEW: "bg-amber-100 text-amber-700 border-amber-200",
  OFFER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ACCEPTED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  WITHDRAWN: "bg-pink-100 text-pink-700 border-pink-200",
};

export function getStatusColor(status: Status): string {
  return STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
}

export const SOURCE_OPTIONS = [
  "LinkedIn",
  "Referral",
  "Company site",
  "Indeed",
  "Handshake",
  "Career fair",
  "Other",
];
