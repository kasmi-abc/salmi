import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp"
import { Toaster } from "@/components/ui/toaster"
import "@/lib/env"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ subsets: ["latin"], weight: ["600","700","800"], variable: "--font-poppins" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Salmi Series — Résumés médicaux pour étudiants en Algérie",
  description: "La référence des résumés médicaux pour le résidanat en Algérie. Pneumologie, Gynécologie, Urologie, Cardiologie et plus.",
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  openGraph: { title: "Salmi Series", description: "Résumés médicaux d'excellence", type: "website", images: ["/logo.jpg"] }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-white text-slate-900">
        <Navbar />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <WhatsappButton />
        <Toaster />
      </body>
    </html>
  )
}
