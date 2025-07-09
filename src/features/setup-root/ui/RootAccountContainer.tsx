"use client";

import { RootAccountForm } from "./RootAccountForm";
import { useRootAccountSetup } from "../hooks/useRootAccountSetup";
import { toast } from "sonner";
import type { RootAccountCreateRequest } from "@/entities/setup/model";

export function RootAccountContainer() {
  const { status, createRootAccount, isCreating, error } =
    useRootAccountSetup();

  const handleCreateAccount = (data: RootAccountCreateRequest) => {
    createRootAccount(data, {
      onSuccess: () => {
        toast.success(
          "Root account created successfully! PEM file downloaded."
        );
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create root account");
      },
    });
  };

  return (
    <RootAccountForm
      onSubmit={handleCreateAccount}
      isLoading={isCreating}
      error={error}
      accountExists={status?.exists}
    />
  );
}
