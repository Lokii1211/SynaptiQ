import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { NotificationToast } from "@/components/NotificationToast";

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
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkillTen" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", '--font-heading': "'Outfit', 'Inter', system-ui, sans-serif" } as React.CSSProperties}>
        <LanguageProvider>
          {children}
          <NotificationToast />
        </LanguageProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        ` }} />
      </body>
    </html>
  );
}
