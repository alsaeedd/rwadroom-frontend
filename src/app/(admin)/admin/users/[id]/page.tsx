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
import type { AdminUser, UserStatus } from "@/lib/types";
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, CreditCard } from "lucide-react";

const statusVariant: Record<UserStatus, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ action: string; title: string; message: string } | null>(null);

  const fetchUser = () => {
    setIsLoading(true);
    api<AdminUser>(`/admin/users/${id}`)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchUser(); }, [id]);

  const performAction = async (action: string) => {
    setError("");
    setSuccess("");
    setActionLoading(action);
    setConfirmModal(null);

    try {
      if (action === "approve") {
        await api(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "APPROVED" }) });
        setSuccess("User approved successfully.");
      } else if (action === "reject") {
        await api(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "REJECTED" }) });
        setSuccess("User rejected.");
      } else if (action === "promote") {
        await api(`/admin/users/${id}/promote-admin`, { method: "POST" });
        setSuccess("User promoted to admin.");
      } else if (action === "activate-sub") {
        await api(`/admin/users/${id}/subscription`, { method: "PATCH", body: JSON.stringify({ active: true }) });
        setSuccess("Subscription activated.");
      } else if (action === "deactivate-sub") {
        await api(`/admin/users/${id}/subscription`, { method: "PATCH", body: JSON.stringify({ active: false }) });
        setSuccess("Subscription deactivated.");
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

  return (
    <div>
      <button
        onClick={() => router.push("/admin/users")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </button>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-muted text-sm mt-0.5">{user.email}</p>
            </div>
            <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Role</p>
              <Badge variant="info">{user.role}</Badge>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Email Verified</p>
              <p className={user.emailVerified ? "text-emerald-600 font-medium" : "text-muted"}>
                {user.emailVerified ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Joined</p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {user.role === "STARTUP" && (
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Subscription</p>
                <Badge variant={user.subscriptionActive ? "success" : "neutral"}>
                  {user.subscriptionActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
          </div>

          {/* Profile details if available */}
          {user.startupProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">Startup Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">Company:</span> {user.startupProfile.companyName}</div>
                {user.startupProfile.industry && <div><span className="text-muted">Industry:</span> {user.startupProfile.industry}</div>}
                {user.startupProfile.website && <div><span className="text-muted">Website:</span> {user.startupProfile.website}</div>}
                {user.startupProfile.description && <p className="col-span-2 text-muted">{user.startupProfile.description}</p>}
              </div>
            </div>
          )}

          {user.mentorProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">Mentor Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {user.mentorProfile.title && <div><span className="text-muted">Title:</span> {user.mentorProfile.title}</div>}
                {user.mentorProfile.expertise.length > 0 && (
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {user.mentorProfile.expertise.map((e) => (
                      <Badge key={e} variant="neutral">{e}</Badge>
                    ))}
                  </div>
                )}
                {user.mentorProfile.bio && <p className="col-span-2 text-muted">{user.mentorProfile.bio}</p>}
              </div>
            </div>
          )}

          {user.partnerProfile && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">Partner Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">Company:</span> {user.partnerProfile.companyName}</div>
                <div><span className="text-muted">Discount:</span> {user.partnerProfile.discountDescription}</div>
                {user.partnerProfile.website && <div><span className="text-muted">Website:</span> {user.partnerProfile.website}</div>}
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {user.status === "PENDING" && (
            <Card>
              <h3 className="font-semibold mb-4">Approval</h3>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  isLoading={actionLoading === "approve"}
                  onClick={() => setConfirmModal({ action: "approve", title: "Approve User", message: `Approve ${user.firstName} ${user.lastName}?` })}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  isLoading={actionLoading === "reject"}
                  onClick={() => setConfirmModal({ action: "reject", title: "Reject User", message: `Reject ${user.firstName} ${user.lastName}? They will not be able to log in.` })}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
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
                  onClick={() => setConfirmModal({ action: "deactivate-sub", title: "Deactivate Subscription", message: "This will remove the user's access to premium features." })}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Deactivate
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  isLoading={actionLoading === "activate-sub"}
                  onClick={() => setConfirmModal({ action: "activate-sub", title: "Activate Subscription", message: "This will grant the user access to all premium features." })}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Activate
                </Button>
              )}
            </Card>
          )}

          {user.role !== "ADMIN" && (
            <Card>
              <h3 className="font-semibold mb-4">Admin Access</h3>
              <Button
                variant="outline"
                className="w-full"
                isLoading={actionLoading === "promote"}
                onClick={() => setConfirmModal({ action: "promote", title: "Promote to Admin", message: `This will give ${user.firstName} full admin access. This cannot be undone.` })}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Promote to Admin
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <Modal open={true} onClose={() => setConfirmModal(null)} title={confirmModal.title}>
          <p className="text-sm text-muted mb-6">{confirmModal.message}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setConfirmModal(null)}>Cancel</Button>
            <Button
              variant={confirmModal.action === "reject" ? "danger" : "primary"}
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
