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
export type SubscriptionStatus = "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY";
export type ResourceType = "FILE" | "LINK";
export type ResourceStatus = "ACTIVE" | "ARCHIVED" | "PENDING_REVIEW" | "REJECTED";
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
  trialEndsAt?: string | null; // running free trial, admin detail only
}

// ─── Profiles ───────────────────────────────────────────────────────────────

export interface StartupProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string | null;
  sectors: Sector[];
  businessStage?: BusinessStage | null;
  locations: Country[];
  website?: string | null;
  logoUrl?: string | null;
  crNumber?: string | null;
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
  website?: string | null;
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
  crNumber?: string | null;
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
  sectors: Sector[];
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
  rejectionReason?: string | null;
  publishedAt?: string | null;
  uploadedById?: string | null;
  uploadedBy?: { firstName: string; lastName: string; role: Role } | null;
  createdAt: string;
  updatedAt: string;
  category?: ResourceCategory;
  locked?: boolean;
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

// ─── Bookings (on-platform mentor scheduling) ───────────────────────────────

export type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface AvailabilityWindow {
  id?: string;
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startTime: string; // "HH:MM" Bahrain local
  endTime: string; // "HH:MM" Bahrain local
}

export interface AvailabilityResponse {
  windows: AvailabilityWindow[];
}

export interface BookingSlot {
  start: string; // ISO-8601 UTC
  label: string; // human-readable, Bahrain time
}

export interface SlotsResponse {
  mentorId: string;
  durationMin: number;
  slots: BookingSlot[];
}

export interface Booking {
  id: string;
  scheduledAt: string;
  durationMin: number;
  status: BookingStatus;
  purpose?: string | null;
  meetingUrl: string;
  whenLabel: string;
  isPast: boolean;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  mentor: {
    userId: string;
    name: string;
    title?: string | null;
    photoUrl?: string | null;
    email: string;
  };
  startup: {
    userId: string;
    name: string;
    companyName?: string | null;
    email: string;
  };
}

export interface BookingsListResponse {
  upcoming: Booking[];
  past: Booking[];
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobStatus = "PENDING_REVIEW" | "ACTIVE" | "REJECTED" | "CLOSED";

export interface Job {
  id: string;
  postedById: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  type: JobType;
  sector?: Sector | null;
  applyUrl?: string | null;
  applyEmail?: string | null;
  status: JobStatus;
  rejectionReason?: string | null;
  expiresAt: string;
  expired: boolean; // past expiresAt, computed by the API
  createdAt: string;
  updatedAt: string;
  postedBy?: { firstName: string; lastName: string; email: string }; // admin list only
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  users: { total: number; byRole: Record<Role, number> };
  pendingApprovals: { startups: number; mentors: number; partners: number; total: number };
  jobs: { pendingReview: number };
  subscriptions: { active: number; expired: number; pendingPayment: number };
  introductions: {
    pending: number;
    inProgress: number;
    completed: number;
    declined: number;
    total: number;
  };
  resources: { active: number; archived: number; pendingReview: number; public: number; membersOnly: number };
  newSignupsLast30Days: number;
  tickets: { open: number };
  generatedAt: string;
}

// ─── Support tickets ────────────────────────────────────────────────────────

export type TicketStatus = "OPEN" | "ANSWERED" | "CLOSED";

export interface TicketMessage {
  id: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  author?: { firstName: string; lastName: string };
}

/** List rows carry lastMessage; the thread carries user + messages. */
export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; firstName: string; lastName: string; email: string; role: Role };
  lastMessage?: { body: string; isStaff: boolean; createdAt: string } | null;
  messages?: TicketMessage[];
}
