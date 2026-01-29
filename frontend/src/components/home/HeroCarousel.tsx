'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    align?: 'left' | 'center' | 'right';
}

const slides: HeroSlide[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
        title: 'Bộ Sưu Tập Xuân Hè 2025',
        subtitle: 'Mới Ra Mắt',
        description: 'Khám phá xu hướng thời trang mới nhất với phong cách độc đáo và chất lượng cao cấp',
        primaryCta: { text: 'Khám phá ngay', href: '/products?collection=spring-summer' },
        secondaryCta: { text: 'Xem lookbook', href: '/products' },
        align: 'left',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
        title: 'Giảm Đến 50%',
        subtitle: 'Flash Sale',
        description: 'Ưu đãi có hạn! Nhanh tay sở hữu những món đồ yêu thích với giá cực sốc',
        primaryCta: { text: 'Mua sắm ngay', href: '/products?sale=true' },
        align: 'center',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
        title: 'Phong Cách Công Sở',
        subtitle: 'Bộ Sưu Tập Mới',
        description: 'Thanh lịch, chuyên nghiệp với các thiết kế hiện đại cho môi trường làm việc',
        primaryCta: { text: 'Xem ngay', href: '/products?category=office' },
        secondaryCta: { text: 'Tư vấn phối đồ', href: '/products' },
        align: 'right',
    },
];

export default function HeroCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 6000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="relative overflow-hidden">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className="flex-[0_0_100%] min-w-0 relative"
                        >
                            {/* Background Image */}
                            <div
                                className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[calc(100vh-80px)] bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                {/* Gradient Overlay */}
                                <div className={cn(
                                    'absolute inset-0',
                                    slide.align === 'center' 
                                        ? 'bg-black/50'
                                        : slide.align === 'right'
                                        ? 'bg-gradient-to-l from-black/70 via-black/40 to-transparent'
                                        : 'bg-gradient-to-r from-black/70 via-black/40 to-transparent'
                                )} />

                                {/* Content */}
                                <div className="relative h-full container mx-auto px-4">
                                    <div className={cn(
                                        'h-full min-h-[600px] md:min-h-[700px] lg:min-h-[calc(100vh-80px)] flex items-center',
                                        slide.align === 'center' && 'justify-center text-center',
                                        slide.align === 'right' && 'justify-end text-right'
                                    )}>
                                        <AnimatePresence mode="wait">
                                            {selectedIndex === index && (
                                                <motion.div
                                                    key={slide.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -30 }}
                                                    transition={{ duration: 0.6 }}
                                                    className={cn(
                                                        'max-w-2xl',
                                                        slide.align === 'right' && 'mr-0 lg:mr-12'
                                                    )}
                                                >
                                                    {/* Subtitle badge */}
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-white bg-accent-500 rounded-full"
                                                    >
                                                        {slide.subtitle}
                                                    </motion.span>

                                                    {/* Title */}
                                                    <motion.h1
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
                                                    >
                                                        {slide.title}
                                                    </motion.h1>

                                                    {/* Description */}
                                                    <motion.p
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                        className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl"
                                                    >
                                                        {slide.description}
                                                    </motion.p>

                                                    {/* CTA Buttons */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5 }}
                                                        className={cn(
                                                            'flex flex-wrap gap-4',
                                                            slide.align === 'center' && 'justify-center',
                                                            slide.align === 'right' && 'justify-end'
                                                        )}
                                                    >
                                                        <Link href={slide.primaryCta.href}>
                                                            <Button size="xl" className="shadow-2xl">
                                                                {slide.primaryCta.text}
                                                            </Button>
                                                        </Link>
                                                        {slide.secondaryCta && (
                                                            <Link href={slide.secondaryCta.href}>
                                                                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-gray-900">
                                                                    {slide.secondaryCta.text}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Previous slide"
            >
                <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Next slide"
            >
                <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Pagination */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            index === selectedIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/70'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
