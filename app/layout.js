import { Geist, Geist_Mono } from "next/font/google";
import ClientRootWrapper from './ClientRootWrapper';
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
  title: "Haat Seba | Secure Marketing",
  description: "Haat Seba is a secure and profitable eCommarces platform. Build your future through monthly deposits.",
  keywords: ["haatseba", "Haat Seba", "haat seba", "HaatSeba", "investment", "Bangladesh"],
  author: "Haat Seba",
  metadataBase: new URL('https://haatseba.com'),
  openGraph: {
    title: "Haat Seba | Secure Marketing",
    description: "A secure and profitable monthly savings and investment plan",
    url: "https://haatseba.com",
    siteName: "Haat Seba",
    images: [
      {
        url: "https://haatseba.com/trust1x.png",
        width: 1200,
        height: 630,
        alt: "Haat Seba Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haat Seba",
    description: "A secure monthly savings platform",
    images: ["https://haatseba.com/trust1x.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRootWrapper>{children}</ClientRootWrapper>
      </body>
    </html>
  );
}