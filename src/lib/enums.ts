// Human-readable labels + ordered option lists for every backend enum.
// Single source of truth for selects, badges, and table cells.

import type {
  BusinessStage,
  Country,
  IndustryFocus,
  IntroductionStatus,
  Language,
  ProfileStatus,
  Role,
  Sector,
  SubscriptionStatus,
  Urgency,
  UserStatus,
} from "./types";

export const SECTOR_LABEL: Record<Sector, string> = {
  FINTECH: "FinTech",
  ECOMMERCE: "E-commerce",
  SAAS: "SaaS",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  LOGISTICS: "Logistics",
  FOOD_AND_BEVERAGE: "Food & Beverage",
  REAL_ESTATE: "Real Estate",
  MARKETING: "Marketing",
  CONSULTING: "Consulting",
  MANUFACTURING: "Manufacturing",
  TOURISM: "Tourism",
  MEDIA: "Media",
  OTHER: "Other",
};

export const SECTOR_OPTIONS: { value: Sector; label: string }[] = (
  Object.keys(SECTOR_LABEL) as Sector[]
).map((value) => ({ value, label: SECTOR_LABEL[value] }));

export const BUSINESS_STAGE_LABEL: Record<BusinessStage, string> = {
  IDEA: "Idea",
  PRE_SEED: "Pre-seed",
  SEED: "Seed",
  EARLY_REVENUE: "Early Revenue",
  GROWTH: "Growth",
  ESTABLISHED: "Established",
};

// Plain-English one-liners shown under the dropdown so founders know
// which stage actually describes them. Kept short and jargon-light.
export const BUSINESS_STAGE_DESCRIPTION: Record<BusinessStage, string> = {
  IDEA: "Validating the idea — no product or revenue yet.",
  PRE_SEED: "Building a prototype with founder savings, friends, or angel money.",
  SEED: "First external funding raised; building and launching the MVP.",
  EARLY_REVENUE: "First paying customers; finding product-market fit.",
  GROWTH: "Repeatable revenue; scaling team, customers, and operations.",
  ESTABLISHED: "Profitable or at scale; expanding products or markets.",
};

export const BUSINESS_STAGE_OPTIONS: { value: BusinessStage; label: string }[] = (
  Object.keys(BUSINESS_STAGE_LABEL) as BusinessStage[]
).map((value) => ({ value, label: BUSINESS_STAGE_LABEL[value] }));

// Same options, but with descriptions attached — for descriptive dropdowns.
export const BUSINESS_STAGE_DESCRIBED_OPTIONS: {
  value: BusinessStage;
  label: string;
  description: string;
}[] = (Object.keys(BUSINESS_STAGE_LABEL) as BusinessStage[]).map((value) => ({
  value,
  label: BUSINESS_STAGE_LABEL[value],
  description: BUSINESS_STAGE_DESCRIPTION[value],
}));

export const INDUSTRY_FOCUS_LABEL: Record<IndustryFocus, string> = {
  TECHNOLOGY: "Technology",
  FINANCE: "Finance",
  HEALTHCARE: "Healthcare",
  OPERATIONS: "Operations",
  MARKETING_SALES: "Marketing & Sales",
  LEGAL: "Legal",
  HUMAN_RESOURCES: "Human Resources",
  STRATEGY: "Strategy",
  PRODUCT: "Product",
  OTHER: "Other",
};

export const INDUSTRY_FOCUS_OPTIONS: { value: IndustryFocus; label: string }[] = (
  Object.keys(INDUSTRY_FOCUS_LABEL) as IndustryFocus[]
).map((value) => ({ value, label: INDUSTRY_FOCUS_LABEL[value] }));

export const COUNTRY_LABEL: Record<Country, string> = {
  BAHRAIN: "Bahrain",
  KSA: "Saudi Arabia",
  UAE: "UAE",
  QATAR: "Qatar",
  KUWAIT: "Kuwait",
  OMAN: "Oman",
  WORLDWIDE: "Worldwide",
};

export const COUNTRY_OPTIONS: { value: Country; label: string }[] = (
  Object.keys(COUNTRY_LABEL) as Country[]
).map((value) => ({ value, label: COUNTRY_LABEL[value] }));

export const LANGUAGE_LABEL: Record<Language, string> = {
  ARABIC: "Arabic",
  ENGLISH: "English",
  HINDI: "Hindi",
  URDU: "Urdu",
  TAGALOG: "Tagalog",
  FRENCH: "French",
};

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = (
  Object.keys(LANGUAGE_LABEL) as Language[]
).map((value) => ({ value, label: LANGUAGE_LABEL[value] }));

export const ROLE_LABEL: Record<Role, string> = {
  STARTUP: "Startup / SME",
  MENTOR: "Mentor",
  PARTNER: "Partner",
  ADMIN: "Admin",
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  INCOMPLETE: "Incomplete",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const PROFILE_STATUS_LABEL: Record<ProfileStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const SUBSCRIPTION_STATUS_LABEL: Record<SubscriptionStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const INTRODUCTION_STATUS_LABEL: Record<IntroductionStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DECLINED: "Declined",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
