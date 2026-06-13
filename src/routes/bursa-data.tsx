import { createFileRoute } from "@tanstack/react-router";
import BursaDataEntry from "../components/BursaDataEntry";

export const Route = createFileRoute("/bursa-data")({
  head: () => ({
    meta: [
      { title: "Bursa Data Entry — ET Smart Wealth Gateway" },
      { name: "description", content: "Capture and validate Bursa Malaysia market data before staging promotion." },
      { property: "og:title", content: "Bursa Data Entry — ET Smart Wealth Gateway" },
      { property: "og:description", content: "Capture and validate Bursa Malaysia market data before staging promotion." },
    ],
  }),
  component: BursaDataEntry,
});
