import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Lato } from "next/font/google";
const poppins = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});
import "./globals.css";

export const metadata: Metadata = {
  title: " AI Image Caption Generator",
  description:
    "Trendy AI Image Caption Generator is a cutting-edge tool that creates engaging and trendy captions for your images using AI. Whether you're a social media influencer, marketer, or just someone looking to add a creative touch to your photos, this tool will help you generate the perfect captions to make your images stand out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}  antialiased bg-purple-50`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
