import { IBM_Plex_Sans_KR, Noto_Serif_KR } from "next/font/google";

import Providers from "@/app/providers";
import TokenStyle from "@/app/ui/token-style";

import "@/app/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const sans = IBM_Plex_Sans_KR({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Noto_Serif_KR({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "한장 BO",
  description: "한장 운영 웹",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ko" className={`${sans.variable} ${serif.variable}`}>
    <body>
      <TokenStyle />
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
