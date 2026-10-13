import { Metadata } from "next";
import { SalesdockQAClient } from "@/components/salesdock/SalesdockQAClient";

export const metadata: Metadata = {
  title: "Salesdock Interview Q&A - Codebase & Specs",
  description: "Comprehensive interview questions, answers, and architectural explanations for the Salesdock assignment.",
};

export default function SalesdockQAPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <SalesdockQAClient />
    </div>
  );
}
