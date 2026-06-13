import { createFileRoute } from "@tanstack/react-router";
import UserAdministration from "../components/UserAdministration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "User Administration — ET Smart Wealth Gateway" },
      { name: "description", content: "Provision staff accounts and govern module access across the Smart Wealth Gateway." },
      { property: "og:title", content: "User Administration — ET Smart Wealth Gateway" },
      { property: "og:description", content: "Provision staff accounts and govern module access across the Smart Wealth Gateway." },
    ],
  }),
  component: UserAdministration,
});
