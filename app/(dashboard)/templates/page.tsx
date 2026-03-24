import type { Metadata } from "next";
import { TemplatesContent } from "@/components/dashboard/templates-content";

export const metadata: Metadata = {
  title: "Templates",
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
