import { createFileRoute } from "@tanstack/react-router";
import StagingAnalyticsReview from "../components/StagingAnalyticsReview";

export const Route = createFileRoute("/staging")({
  head: () => ({
    meta: [
      { title: "Staging Analytics Review — ET Smart Wealth Gateway" },
      { name: "description", content: "Inspect validated datasets in staging and confirm analytical integrity before release." },
      { property: "og:title", content: "Staging Analytics Review — ET Smart Wealth Gateway" },
      { property: "og:description", content: "Inspect validated datasets in staging and confirm analytical integrity before release." },
    ],
  }),
  component: StagingAnalyticsReview,
});
