import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillTen — AI Career Intelligence Platform",
  description: "Discover your career DNA with AI-powered 4D assessment, skill gap analysis, coding arena, and personalized roadmaps. Built for Indian students.",
  keywords: ["SkillTen", "career guidance", "AI", "psychometric test", "skill gap", "resume builder", "India", "placement", "career assessment"],
  openGraph: {
    title: "SkillTen — AI Career Intelligence Platform",
    description: "Your career DNA decoded. AI-powered 4D profiling, coding arena, job matching — built for Indian students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366F1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
