import { createFileRoute } from "@tanstack/react-router";
import ApprovalManagement from "../components/ApprovalManagement";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approval Management — ET Smart Wealth Gateway" },
      { name: "description", content: "Dual-verification gatekeeping process for financial data approval." },
    ],
  }),
  component: ApprovalManagement,
});