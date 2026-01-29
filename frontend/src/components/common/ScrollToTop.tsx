'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
    threshold?: number;
    className?: string;
}

export default function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className={cn(
                        'fixed bottom-6 right-6 z-50',
                        'w-12 h-12 rounded-full',
                        'bg-primary-600 text-white shadow-lg shadow-primary-600/30',
                        'flex items-center justify-center',
                        'hover:bg-primary-700 transition-colors',
                        className
                    )}
                    aria-label="Lên đầu trang"
                >
                    <FiArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
