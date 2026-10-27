import type { Metadata } from "next";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = { title: site.title, description: site.description };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="border-t border-stone-200">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-8 text-sm text-stone-600">
            <p>{site.name} · Made with intention.</p>
            <a href="#main" className="underline underline-offset-4">Back to top</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
