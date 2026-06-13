import { createFileRoute } from "@tanstack/react-router";
import AutomatedOnboardingWizard from "../components/AutomatedOnboardingWizard";

export const Route = createFileRoute("/kyc")({
  head: () => ({
    meta: [
      { title: "e-KYC Setup — Automated Onboarding Wizard" },
      { name: "description", content: "Complete your e-KYC verification with our automated onboarding wizard." },
      { property: "og:title", content: "e-KYC Setup — Automated Onboarding Wizard" },
      { property: "og:description", content: "Complete your e-KYC verification with our automated onboarding wizard." },
    ],
  }),
  component: AutomatedOnboardingWizard,
});
