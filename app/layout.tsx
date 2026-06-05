import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DENSO Sense",
  description: "DENSO Sense — The Future of Smarter Vehicle Diagnosis.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="canvas">{children}</div>
      </body>
    </html>
  );
}
