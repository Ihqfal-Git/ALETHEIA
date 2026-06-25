import "./globals.css";
import { Inter } from "next/font/google";
import SidebarWrapper from "@/components/SidebarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ALETHEIA - Sistem Pakar Diagnosa Elektronik",
  description: "Sistem Pakar Diagnosa Kerusakan Elektronik dengan Dukungan Agentic AI berbasis Next.js dan Gemini API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className={`${inter.className} h-full bg-white text-neutral-950 flex flex-col`}>
        <SidebarWrapper>
          {children}
        </SidebarWrapper>
      </body>
    </html>
  );
}
