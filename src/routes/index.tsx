import { createFileRoute } from "@tanstack/react-router";
import SMECorporateTreasuryHub from "../components/SMECorporateTreasuryHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Portfolio — SME Corporate Treasury Hub" },
      { name: "description", content: "Real-time overview of your corporate accounts, liquidity, and treasury." },
      { property: "og:title", content: "My Portfolio — SME Corporate Treasury Hub" },
      { property: "og:description", content: "Real-time overview of your corporate accounts, liquidity, and treasury." },
    ],
  }),
  component: SMECorporateTreasuryHub,
});
