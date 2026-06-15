import { createFileRoute } from "@tanstack/react-router";
import SecurityManagement from "../components/SecurityManagement";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security Management — ET Smart Wealth Gateway" },
      { name: "description", content: "Monitor access, enforce security policies, and maintain audit records." },
    ],
  }),
  component: SecurityManagement,
});