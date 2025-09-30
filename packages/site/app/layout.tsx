import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Zama FHEVM SDK Quickstart",
  description: "Zama FHEVM SDK Quickstart app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-foreground antialiased">
        <div 
          className="fixed inset-0 w-full h-full z-[-20] min-w-[850px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.png')"
          }}
        ></div>
        <main className="flex flex-col w-full h-screen">
          <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-between items-center relative z-10">
            <Image
              src="/zama-logo.svg"
              alt="Zama Logo"
              width={120}
              height={120}
            />
          </nav>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
