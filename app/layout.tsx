import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLV User Study Interface",
  description: "Accessible frontend for BLV image-description ordering study"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
