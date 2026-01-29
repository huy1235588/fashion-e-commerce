import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ToastProvider } from "@/components/common/Toast";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    display: "swap",
    variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin", "vietnamese"],
    display: "swap",
    variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
    title: "Fashion Store - Thời trang cao cấp",
    description: "Website thương mại điện tử bán hàng thời trang",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={`${inter.variable} ${plusJakarta.variable} scroll-smooth`}>
            <body className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <ScrollToTop />
                <ToastProvider />
            </body>
        </html>
    );
}
