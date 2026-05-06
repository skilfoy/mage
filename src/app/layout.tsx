import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title:"PromptLock Academy", description:"Authorized synthetic prompt-injection training lab" };
export default function RootLayout({children}:{children:React.ReactNode}){ return <html lang="en"><body><main className="mx-auto min-h-screen max-w-6xl px-4 py-8">{children}</main></body></html>; }
