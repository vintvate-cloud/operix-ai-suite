import { AuthProvider } from "@/lib/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter, Anton } from "next/font/google";
import "@/styles.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata = {
  title: "OPERIX — The AI Operating System for Hospitality",
  description: "Run your entire hotel from one AI operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      <body className="antialiased">
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-op-purple/30">
              {children}
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
