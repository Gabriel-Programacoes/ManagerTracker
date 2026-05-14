import type { Metadata } from "next";
import { Chakra_Petch, Teko } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManagerTracker",
  description: "EA FC manager career tracker dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${teko.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Theme appearance="dark" accentColor="lime" grayColor="gray" radius="none">
          {children}
        </Theme>
      </body>
    </html>
  );
}
