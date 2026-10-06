import { Metadata } from "next";
import { SalesdockLandingClient } from "@/components/salesdock/SalesdockLandingClient";

export const metadata: Metadata = {
  title: "Salesdock Assignment - Codebase & Specs",
  description: "Visual folder structure and complete markdown documentation for the Salesdock assignment codebase.",
};

export default function SalesdockLandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SalesdockLandingClient />
    </div>
  );
}
