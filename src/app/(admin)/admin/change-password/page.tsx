"use client";

import { ChangePasswordForm } from "@/components/change-password-form";

export default function AdminChangePasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Change Password</h1>
      <p className="text-muted mb-8">Update your account password.</p>
      <ChangePasswordForm />
    </div>
  );
}
