import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./components/footer";
import MoveToTopButton from './components/MoveToTopButton';
import Navbar from "./components/navbars";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Haat Seba | Secure Savings",
  description: "Trust1x DPS is a secure and profitable savings platform. Build your future through monthly deposits.",
  keywords: ["Trust1x", "Trust1x dps", "DPS", "monthly savings", "investment", "Bangladesh"],
  author: "Trust1x Team",
  metadataBase: new URL('https://trust1xdps.com'),
  openGraph: {
    title: "Trust1x DPS | Secure Savings",
    description: "A secure and profitable monthly savings and investment plan",
    url: "https://trust1xdps.com",
    siteName: "Trust1x DPS",
    images: [
      {
        url: "https://trust1xdps.com/trust1x.png",
        width: 1200,
        height: 630,
        alt: "Trust1x DPS Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust1x DPS",
    description: "A secure monthly savings platform",
    images: ["https://trust1xdps.com/trust1x.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <MoveToTopButton /> {/* "Move to Top" বাটন */}
        <Footer/>
      </body>
    </html>
  );
}
