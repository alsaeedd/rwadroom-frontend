"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import {
  BUSINESS_STAGE_LABEL,
  COUNTRY_LABEL,
  INDUSTRY_FOCUS_LABEL,
  LANGUAGE_LABEL,
  PROFILE_STATUS_LABEL,
  ROLE_LABEL,
  SECTOR_LABEL,
  USER_STATUS_LABEL,
} from "@/lib/enums";
import type {
  AdminUser,
  MentorProfile,
  PartnerProfile,
  ProfileStatus,
  StartupProfile,
  UserStatus,
} from "@/lib/types";
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle2,
  CreditCard,
  Power,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

const userStatusVariant: Record<UserStatus, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

const profileStatusVariant: Record<ProfileStatus, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

type ActionId =
  | "approve"
  | "reject"
  | "promote"
  | "activate-sub"
  | "deactivate-sub"
  | "approve-profile"
  | "reject-profile"
  | "activate-user"
  | "deactivate-user"
  | "toggle-notifications";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentAdmin = useAuthStore((s) => s.user);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<ActionId | "">("");
  const [confirmModal, setConfirmModal] = useState<{
    action: ActionId;
    title: string;
    message: string;
    danger?: boolean;
  } | null>(null);

  const fetchUser = () => {
    setIsLoading(true);
    api<AdminUser>(`/admin/users/${id}`)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const performAction = async (action: ActionId) => {
    setError("");
    setSuccess("");
    setActionLoading(action);
    setConfirmModal(null);

    try {
      switch (action) {
        case "approve":
          await api(`/admin/users/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "APPROVED" }),
          });
          setSuccess("User approved. Their profile is now publicly listed.");
          break;
        case "reject":
          await api(`/admin/users/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "REJECTED" }),
          });
          setSuccess("User rejected.");
          break;
        case "approve-profile":
          await api(`/admin/users/${id}/profile-status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "APPROVED" }),
          });
          setSuccess("Profile approved for public listing.");
          break;
        case "reject-profile":
          await api(`/admin/users/${id}/profile-status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "REJECTED" }),
          });
          setSuccess("Profile hidden from public listings.");
          break;
        case "promote":
          await api(`/admin/users/${id}/promote-admin`, { method: "POST" });
          setSuccess("User promoted to admin.");
          break;
        case "activate-sub":
          await api(`/admin/users/${id}/subscription`, {
            method: "PATCH",
            body: JSON.stringify({ active: true }),
          });
          setSuccess("Subscription activated.");
          break;
        case "deactivate-sub":
          await api(`/admin/users/${id}/subscription`, {
            method: "PATCH",
            body: JSON.stringify({ active: false }),
          });
          setSuccess("Subscription deactivated.");
          break;
        case "activate-user":
          await api(`/admin/users/${id}/active`, {
            method: "PATCH",
            body: JSON.stringify({ isActive: true }),
          });
          setSuccess("User reactivated. They can log in again.");
          break;
        case "deactivate-user":
          await api(`/admin/users/${id}/active`, {
            method: "PATCH",
            body: JSON.stringify({ isActive: false }),
          });
          setSuccess("User deactivated. All sessions revoked.");
          break;
        case "toggle-notifications":
          if (!user) break;
          await api(`/admin/users/${id}/notifications`, {
            method: "PATCH",
            body: JSON.stringify({
              receiveIntroNotifications: !user.receiveIntroNotifications,
            }),
          });
          setSuccess("Admin notification preference updated.");
          break;
      }
      fetchUser();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setActionLoading("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted">{error || "User not found."}</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </div>
    );
  }

  const startupProfile = user.role === "STARTUP" ? (user.profile as StartupProfile | null) : null;
  const mentorProfile = user.role === "MENTOR" ? (user.profile as MentorProfile | null) : null;
  const partnerProfile = user.role === "PARTNER" ? (user.profile as PartnerProfile | null) : null;

  const isSelf = currentAdmin?.id === user.id;
  const canControlNotifications =
    user.role === "ADMIN" && currentAdmin?.isSuperAdmin && !isSelf && !user.isSuperAdmin;

  return (
    <div>
      <button
        onClick={() => router.push("/admin/users")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </button>

      {success && (
        <Alert variant="success" className="mb-5">
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                {user.isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> Super Admin
                  </span>
                )}
              </div>
              <p className="text-muted text-sm mt-0.5">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={userStatusVariant[user.status]}>
                {USER_STATUS_LABEL[user.status]}
              </Badge>
              {!user.isActive && <Badge variant="danger">Deactivated</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Role</p>
              <Badge variant="info">{ROLE_LABEL[user.role]}</Badge>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                Email Verified
              </p>
              <p className={user.emailVerified ? "text-emerald-600 font-medium" : "text-muted"}>
                {user.emailVerified ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                Joined
              </p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {user.role === "STARTUP" && (
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                  Subscription
                </p>
                <Badge variant={user.subscriptionActive ? "success" : "neutral"}>
                  {user.subscriptionActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
            {user.role === "ADMIN" && (
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                  Intro Notifications
                </p>
                <Badge variant={user.receiveIntroNotifications ? "success" : "neutral"}>
                  {user.receiveIntroNotifications ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            )}
          </div>

          {/* Startup profile details */}
          {startupProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Startup Profile</h3>
                <Badge variant={profileStatusVariant[startupProfile.status]}>
                  {PROFILE_STATUS_LABEL[startupProfile.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted">Company:</span> {startupProfile.companyName}
                </div>
                {startupProfile.sector && (
                  <div>
                    <span className="text-muted">Sector:</span>{" "}
                    {SECTOR_LABEL[startupProfile.sector]}
                  </div>
                )}
                {startupProfile.businessStage && (
                  <div>
                    <span className="text-muted">Stage:</span>{" "}
                    {BUSINESS_STAGE_LABEL[startupProfile.businessStage]}
                  </div>
                )}
                {startupProfile.website && (
                  <div className="break-all">
                    <span className="text-muted">Website:</span>{" "}
                    <a
                      href={startupProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {startupProfile.website}
                    </a>
                  </div>
                )}
                {startupProfile.locations.length > 0 && (
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {startupProfile.locations.map((c) => (
                      <Badge key={c} variant="neutral">
                        {COUNTRY_LABEL[c]}
                      </Badge>
                    ))}
                  </div>
                )}
                {startupProfile.description && (
                  <p className="col-span-2 text-muted">{startupProfile.description}</p>
                )}
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <span className="text-muted">Public listing:</span>
                  <Badge variant={startupProfile.isPubliclyVisible ? "success" : "neutral"}>
                    {startupProfile.isPubliclyVisible ? "Visible" : "Hidden by owner"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {mentorProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Mentor Profile</h3>
                <Badge variant={profileStatusVariant[mentorProfile.status]}>
                  {PROFILE_STATUS_LABEL[mentorProfile.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {mentorProfile.title && (
                  <div className="col-span-2">
                    <span className="text-muted">Title:</span> {mentorProfile.title}
                  </div>
                )}
                {mentorProfile.expertise.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-muted text-xs uppercase tracking-wide mb-1">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {mentorProfile.expertise.map((e) => (
                        <Badge key={e} variant="neutral">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {mentorProfile.industryFocus.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-muted text-xs uppercase tracking-wide mb-1">
                      Industry Focus
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {mentorProfile.industryFocus.map((i) => (
                        <Badge key={i} variant="info">
                          {INDUSTRY_FOCUS_LABEL[i]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {mentorProfile.languages.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-muted text-xs uppercase tracking-wide mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {mentorProfile.languages.map((l) => (
                        <Badge key={l} variant="neutral">
                          {LANGUAGE_LABEL[l]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {mentorProfile.discountNote && (
                  <p className="col-span-2 text-muted">
                    <span className="font-medium">Discount:</span> {mentorProfile.discountNote}
                  </p>
                )}
                {mentorProfile.bio && (
                  <p className="col-span-2 text-muted">{mentorProfile.bio}</p>
                )}
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <span className="text-muted">Public listing:</span>
                  <Badge variant={mentorProfile.isPubliclyVisible ? "success" : "neutral"}>
                    {mentorProfile.isPubliclyVisible ? "Visible" : "Hidden by owner"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {partnerProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Partner Profile</h3>
                <Badge variant={profileStatusVariant[partnerProfile.status]}>
                  {PROFILE_STATUS_LABEL[partnerProfile.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted">Company:</span> {partnerProfile.companyName}
                </div>
                {partnerProfile.serviceCategory && (
                  <div>
                    <span className="text-muted">Category:</span>{" "}
                    {SECTOR_LABEL[partnerProfile.serviceCategory]}
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted">Discount:</span>{" "}
                  {partnerProfile.discountDescription}
                </div>
                {partnerProfile.discountCode && (
                  <div>
                    <span className="text-muted">Code:</span>{" "}
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                      {partnerProfile.discountCode}
                    </code>
                  </div>
                )}
                {partnerProfile.website && (
                  <div className="break-all">
                    <span className="text-muted">Website:</span>{" "}
                    <a
                      href={partnerProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {partnerProfile.website}
                    </a>
                  </div>
                )}
                {partnerProfile.description && (
                  <p className="col-span-2 text-muted">{partnerProfile.description}</p>
                )}
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <span className="text-muted">Public listing:</span>
                  <Badge variant={partnerProfile.isPubliclyVisible ? "success" : "neutral"}>
                    {partnerProfile.isPubliclyVisible ? "Visible" : "Hidden by owner"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {user.status === "PENDING" && (
            <Card>
              <h3 className="font-semibold mb-1">Account Approval</h3>
              <p className="text-xs text-muted mb-4">
                Approving also publishes their profile to public directories.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  isLoading={actionLoading === "approve"}
                  onClick={() =>
                    setConfirmModal({
                      action: "approve",
                      title: "Approve User",
                      message: `Approve ${user.firstName} ${user.lastName}?`,
                    })
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  isLoading={actionLoading === "reject"}
                  onClick={() =>
                    setConfirmModal({
                      action: "reject",
                      title: "Reject User",
                      message: `Reject ${user.firstName} ${user.lastName}? They will not be able to log in.`,
                      danger: true,
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
              </div>
            </Card>
          )}

          {user.status === "APPROVED" && user.role !== "ADMIN" && user.profile && (
            <Card>
              <h3 className="font-semibold mb-1">Profile Listing</h3>
              <p className="text-xs text-muted mb-4">
                Re-approve a profile after edits, or hide it from public directories without
                touching the user&rsquo;s account.
              </p>
              <div className="flex flex-col gap-2">
                {user.profile.status !== "APPROVED" && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    isLoading={actionLoading === "approve-profile"}
                    onClick={() =>
                      setConfirmModal({
                        action: "approve-profile",
                        title: "Approve Profile",
                        message: "Publish this profile to the public directory?",
                      })
                    }
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Profile
                  </Button>
                )}
                {user.profile.status !== "REJECTED" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    isLoading={actionLoading === "reject-profile"}
                    onClick={() =>
                      setConfirmModal({
                        action: "reject-profile",
                        title: "Hide Profile",
                        message:
                          "This will mark the profile as rejected and hide it from public directories. The user can still log in.",
                      })
                    }
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Hide Profile
                  </Button>
                )}
              </div>
            </Card>
          )}

          {user.role === "STARTUP" && (
            <Card>
              <h3 className="font-semibold mb-4">Subscription Override</h3>
              {user.subscriptionActive ? (
                <Button
                  variant="outline"
                  className="w-full"
                  isLoading={actionLoading === "deactivate-sub"}
                  onClick={() =>
                    setConfirmModal({
                      action: "deactivate-sub",
                      title: "Deactivate Subscription",
                      message: "This will remove the user's access to premium features.",
                    })
                  }
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Deactivate
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  isLoading={actionLoading === "activate-sub"}
                  onClick={() =>
                    setConfirmModal({
                      action: "activate-sub",
                      title: "Activate Subscription",
                      message: "This will grant the user access to all premium features.",
                    })
                  }
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Activate
                </Button>
              )}
            </Card>
          )}

          {!isSelf && !user.isSuperAdmin && (
            <Card>
              <h3 className="font-semibold mb-1">Account Access</h3>
              <p className="text-xs text-muted mb-4">
                {user.isActive
                  ? "Deactivating revokes all sessions immediately and blocks future logins."
                  : "Reactivating restores the user's ability to log in."}
              </p>
              {user.isActive ? (
                <Button
                  variant="danger"
                  className="w-full"
                  isLoading={actionLoading === "deactivate-user"}
                  onClick={() =>
                    setConfirmModal({
                      action: "deactivate-user",
                      title: "Deactivate User",
                      message: `Deactivate ${user.firstName}? All their sessions will be revoked immediately.`,
                      danger: true,
                    })
                  }
                >
                  <Power className="mr-2 h-4 w-4" /> Deactivate Account
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  isLoading={actionLoading === "activate-user"}
                  onClick={() =>
                    setConfirmModal({
                      action: "activate-user",
                      title: "Reactivate User",
                      message: `Reactivate ${user.firstName}'s account?`,
                    })
                  }
                >
                  <Power className="mr-2 h-4 w-4" /> Reactivate Account
                </Button>
              )}
            </Card>
          )}

          {canControlNotifications && (
            <Card>
              <h3 className="font-semibold mb-1">Notification Override</h3>
              <p className="text-xs text-muted mb-4">
                As super-admin you can override another admin&rsquo;s introduction-notification
                setting.
              </p>
              <Button
                variant="outline"
                className="w-full"
                isLoading={actionLoading === "toggle-notifications"}
                onClick={() =>
                  setConfirmModal({
                    action: "toggle-notifications",
                    title: user.receiveIntroNotifications
                      ? "Disable Notifications"
                      : "Enable Notifications",
                    message: user.receiveIntroNotifications
                      ? `Stop sending introduction-request emails to ${user.firstName}?`
                      : `Resume sending introduction-request emails to ${user.firstName}?`,
                  })
                }
              >
                {user.receiveIntroNotifications ? (
                  <>
                    <BellOff className="mr-2 h-4 w-4" /> Disable Intro Notifications
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" /> Enable Intro Notifications
                  </>
                )}
              </Button>
            </Card>
          )}

          {user.role !== "ADMIN" && user.status === "APPROVED" && (
            <Card>
              <h3 className="font-semibold mb-4">Admin Access</h3>
              <Button
                variant="outline"
                className="w-full"
                isLoading={actionLoading === "promote"}
                onClick={() =>
                  setConfirmModal({
                    action: "promote",
                    title: "Promote to Admin",
                    message: `This will give ${user.firstName} full admin access. This cannot be undone.`,
                  })
                }
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Promote to Admin
              </Button>
            </Card>
          )}
        </div>
      </div>

      {confirmModal && (
        <Modal open={true} onClose={() => setConfirmModal(null)} title={confirmModal.title}>
          <p className="text-sm text-muted mb-6">{confirmModal.message}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setConfirmModal(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmModal.danger ? "danger" : "primary"}
              isLoading={!!actionLoading}
              onClick={() => performAction(confirmModal.action)}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
