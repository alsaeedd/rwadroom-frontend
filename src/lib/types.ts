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
export type UserStatus = "INCOMPLETE" | "PENDING" | "APPROVED" | "REJECTED";
export type ProfileStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubscriptionStatus = "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY";
export type ResourceType = "FILE" | "LINK";
export type ResourceStatus = "ACTIVE" | "ARCHIVED";
export type IntroductionType = "PARTNER_INTRODUCTION" | "MENTOR_SESSION";
export type IntroductionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED";
export type Urgency = "LOW" | "MEDIUM" | "HIGH";

export type Sector =
  | "FINTECH"
  | "ECOMMERCE"
  | "SAAS"
  | "HEALTHCARE"
  | "EDUCATION"
  | "LOGISTICS"
  | "FOOD_AND_BEVERAGE"
  | "REAL_ESTATE"
  | "MARKETING"
  | "CONSULTING"
  | "MANUFACTURING"
  | "TOURISM"
  | "MEDIA"
  | "OTHER";

export type BusinessStage =
  | "IDEA"
  | "PRE_SEED"
  | "SEED"
  | "EARLY_REVENUE"
  | "GROWTH"
  | "ESTABLISHED";

export type IndustryFocus =
  | "TECHNOLOGY"
  | "FINANCE"
  | "HEALTHCARE"
  | "OPERATIONS"
  | "MARKETING_SALES"
  | "LEGAL"
  | "HUMAN_RESOURCES"
  | "STRATEGY"
  | "PRODUCT"
  | "OTHER";

export type Country =
  | "BAHRAIN"
  | "KSA"
  | "UAE"
  | "QATAR"
  | "KUWAIT"
  | "OMAN"
  | "WORLDWIDE";

export type Language = "ARABIC" | "ENGLISH" | "HINDI" | "URDU" | "TAGALOG" | "FRENCH";

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
  isSuperAdmin: boolean;
  receiveIntroNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: StartupProfile | MentorProfile | PartnerProfile | null;
}

// ─── Profiles ───────────────────────────────────────────────────────────────

export interface StartupProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string | null;
  sector?: Sector | null;
  businessStage?: BusinessStage | null;
  locations: Country[];
  website?: string | null;
  logoUrl?: string | null;
  status: ProfileStatus;
  isPubliclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  title?: string | null;
  expertise: string[];
  industryFocus: IndustryFocus[];
  languages: Language[];
  bio?: string | null;
  discountNote?: string | null;
  linkedinUrl?: string | null;
  photoUrl?: string | null;
  status: ProfileStatus;
  isPubliclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string | null;
  serviceCategory?: Sector | null;
  website?: string | null;
  logoUrl?: string | null;
  discountDescription: string;
  discountCode?: string | null;
  status: ProfileStatus;
  isPubliclyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Directory (public-facing) ──────────────────────────────────────────────

export interface StartupListing {
  id: string;
  companyName: string;
  description?: string | null;
  sector?: Sector | null;
  businessStage?: BusinessStage | null;
  locations: Country[];
  website?: string | null;
  logoUrl?: string | null;
}

export interface PartnerListing {
  id: string;
  userId: string; // target id for introduction requests
  companyName: string;
  description?: string | null;
  serviceCategory?: Sector | null;
  website?: string | null;
  logoUrl?: string | null;
  discountDescription?: string | null; // null if not subscribed
  discountCode?: string | null;
  discountLocked?: boolean;
}

export interface MentorListing {
  id: string;
  userId: string; // target id for session requests
  name: string;
  title?: string | null;
  expertise: string[];
  industryFocus: IndustryFocus[];
  languages: Language[];
  bio?: string | null;
  discountNote?: string | null;
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
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: { id: string; firstName: string; lastName: string; email: string };
  target?: { id: string; firstName: string; lastName: string; email?: string; role?: Role };
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  users: { total: number; byRole: Record<Role, number> };
  pendingApprovals: { startups: number; mentors: number; partners: number; total: number };
  subscriptions: { active: number; expired: number; pendingPayment: number };
  introductions: {
    pending: number;
    inProgress: number;
    completed: number;
    declined: number;
    total: number;
  };
  resources: { active: number; archived: number; public: number; membersOnly: number };
  newSignupsLast30Days: number;
  generatedAt: string;
}
