import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
  description: "Discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")} >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="discord-theme">
            <SocketProvider>
              <ModalProvider/>
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
