import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { PackProvider } from "@/components/pack-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Jersey 10: a pixel font whose digits stay distinct (Pixelify drew 5 like S and Z like 2).
const gameFont = Jersey_10({ variable: "--font-game", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "PACKETPACK", template: "%s · PACKETPACK" },
  description:
    "A pixel-art game about exploring cybersecurity hardware. Explore the tools, understand the technology, build your own inventory.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gameFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* "user": animations stop for people who ask their OS for reduced motion. */}
        <MotionConfig reducedMotion="user">
          <PackProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t-[6px] border-ink bg-[#1a1226] px-4 py-5 text-center text-sm text-parchment/75">
              <p className="mx-auto max-w-3xl">
                Educational catalog. Use these tools only on equipment you own or are explicitly authorized to test.
                Specs and prices change: always confirm on the manufacturer&apos;s site. Not affiliated with any
                manufacturer.
              </p>
              <p className="mt-2">
                <a className="underline" href="https://github.com/Amad3eu/packetpack">
                  Source on GitHub
                </a>{" "}
                · MIT License
              </p>
            </footer>
          </PackProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
