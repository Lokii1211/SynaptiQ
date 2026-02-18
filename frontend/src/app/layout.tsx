import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSync AI — AI-Powered Career Guidance",
  description: "Discover your ideal career path with AI-powered psychometric assessments, skill gap analysis, and personalized roadmaps. Built for Indian students.",
  keywords: ["career guidance", "AI", "psychometric test", "skill gap", "resume builder", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
