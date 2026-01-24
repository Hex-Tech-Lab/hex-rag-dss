import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConfigProvider } from "@/contexts/ConfigContext";
import ThemeCustomization from "@/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "hex-rag-dss",
  description: "RAG-Powered Decision Support System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-color-scheme="light">
      <body>
        <ConfigProvider>
          <ThemeCustomization>
            {children}
          </ThemeCustomization>
        </ConfigProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
