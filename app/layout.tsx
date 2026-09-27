import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import { ModeProvider } from "@/components/providers/ModeProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import AmbientBackground from "@/components/cursor/AmbientBackground";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PAARTH://SEC — Interactive Cybersecurity Portfolio",
  description:
    "Interactive cybersecurity portfolio demonstrating security research, application security, security operations, and security engineering capabilities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${ibmPlexSans.variable} h-full antialiased`}
      data-mode="normal"
      data-theme="cyber"
    >
      <body className="min-h-full flex flex-col bg-void text-text-primary cursor-none">
        <CursorProvider>
          <ThemeProvider>
            <ModeProvider>
              <AmbientBackground />
              {children}
              <CustomCursor />
              <Analytics />
            </ModeProvider>
          </ThemeProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
