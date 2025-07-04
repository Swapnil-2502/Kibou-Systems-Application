import type { Metadata } from "next";
import Navbar from "../Components/Navbar";



export const metadata: Metadata = {
  title: "B2B Tender",
  description: "Build by Swapnil Hajare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Navbar />
        {children}
        
      </body>
    </html>
  );
}
