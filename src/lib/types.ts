// Shared TypeScript types used across the frontend

// ─── Pagination ─────────────────────────────────────────────────────────────

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ─── Enums ──────────────────────────────────────────────────────────────────

export type Role = "STARTUP" | "MENTOR" | "PARTNER" | "ADMIN";
export type UserStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProfileStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubscriptionStatus = "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY";
export type ResourceType = "FILE" | "LINK";
export type ResourceStatus = "ACTIVE" | "ARCHIVED";
export type IntroductionType = "PARTNER_INTRODUCTION" | "MENTOR_SESSION";
export type IntroductionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED";
export type Urgency = "LOW" | "MEDIUM" | "HIGH";

// ─── Users ──────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  subscriptionActive: boolean;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  startupProfile?: StartupProfile | null;
  mentorProfile?: MentorProfile | null;
  partnerProfile?: PartnerProfile | null;
}

// ─── Profiles ───────────────────────────────────────────────────────────────

export interface StartupProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string | null;
  industry?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  title?: string | null;
  expertise: string[];
  bio?: string | null;
  linkedinUrl?: string | null;
  photoUrl?: string | null;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  discountDescription: string;
  discountCode?: string | null;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Directory (public-facing) ──────────────────────────────────────────────

export interface PartnerListing {
  id: string;
  companyName: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  discountDescription?: string | null; // null if not subscribed
  discountCode?: string | null;
}

export interface MentorListing {
  id: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  expertise: string[];
  bio?: string | null;
  photoUrl?: string | null;
}

// ─── Resources ──────────────────────────────────────────────────────────────

export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  categoryId: string;
  title: string;
  description?: string | null;
  type: ResourceType;
  fileUrl?: string | null;
  fileType?: string | null;
  externalUrl?: string | null;
  visibility: ResourceVisibility;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
  category?: ResourceCategory;
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Introductions ──────────────────────────────────────────────────────────

export interface Introduction {
  id: string;
  requesterId: string;
  targetId: string;
  type: IntroductionType;
  status: IntroductionStatus;
  purpose: string;
  urgency: Urgency;
  context?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: { id: string; firstName: string; lastName: string; email: string };
  target?: { id: string; firstName: string; lastName: string; email: string };
}
