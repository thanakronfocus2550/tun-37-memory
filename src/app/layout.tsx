import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// แก้ไขข้อมูล Metadata ตรงนี้ครับ
export const metadata: Metadata = {
  title: "อภินิหารสะพานสูง - รุ่น 37",
  description: "บันทึกความทรงจำวันสุดท้ายที่ ต.อ.น. โดย ธนกรและทีมงาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}