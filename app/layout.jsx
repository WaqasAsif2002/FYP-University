import { Inter } from "next/font/google";
import { UserProvider } from "@/context/context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ParkEase - Smart Parking Solutions",
  description: "Book parking spaces at Millennium Mall Karachi in advance",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
