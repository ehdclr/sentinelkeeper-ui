"use client";

import { useSetupStore } from "@/shared/store/setupStore";
import { useMemo } from "react";
import type { SetupStep } from "@/entities/setup/model";

export const useSetupFlow = () => {
  const {
    isSetupCompleted,
    rootAccountExists,
    databaseSetupStatus,
    setIsSetupCompleted,
  } = useSetupStore();

  const steps: SetupStep[] = useMemo(
    () => [
      {
        id: "database",
        title: "Database Configuration",
        description: "Configure metadata storage database",
        completed: Object.keys(databaseSetupStatus || {}).length > 0 || false,
        required: true,
      },
      {
        id: "root-account",
        title: "Root Account Setup",
        description: "Create administrator account",
        completed: rootAccountExists,
        required: true,
      },
    ],
    [databaseSetupStatus?.configured, rootAccountExists]
  );

  const currentStep = useMemo(() => {
    const incompleteStep = steps.find(
      (step) => step.required && !step.completed
    );
    return incompleteStep?.id || null;
  }, [steps]);

  const allStepsCompleted = useMemo(() => {
    return steps.every((step) => !step.required || step.completed);
  }, [steps]);

  const canProceedToDashboard = useMemo(() => {
    return allStepsCompleted && isSetupCompleted;
  }, [allStepsCompleted, isSetupCompleted]);

  const completeSetup = () => {
    if (allStepsCompleted) {
      setIsSetupCompleted(true);
    }
  };

  return {
    steps,
    currentStep,
    allStepsCompleted,
    canProceedToDashboard,
    completeSetup,
  };
};
