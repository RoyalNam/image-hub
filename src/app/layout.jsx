import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'ImageHub App',
    description: 'Generated by ImageHub App',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main className="px-2 md:px-4">{children}</main>
                <ScrollToTopButton />
                <Footer />
            </body>
        </html>
    );
}
