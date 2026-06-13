import { createFileRoute } from "@tanstack/react-router";
import DeploymentReleaseControl from "../components/DeploymentReleaseControl";

export const Route = createFileRoute("/deployment")({
  head: () => ({
    meta: [
      { title: "Deployment Release Control — ET Smart Wealth Gateway" },
      { name: "description", content: "Final gatekeeping authority over releases and promotion to production." },
      { property: "og:title", content: "Deployment Release Control — ET Smart Wealth Gateway" },
      { property: "og:description", content: "Final gatekeeping authority over releases and promotion to production." },
    ],
  }),
  component: DeploymentReleaseControl,
});
