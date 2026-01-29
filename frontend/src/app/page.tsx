'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import { Product, Category } from '@/types';
import Loading from '@/components/common/Loading';
import {
    HeroCarousel,
    FlashSale,
    CategoriesShowcase,
    NewArrivals,
    Testimonials,
    Features,
} from '@/components/home';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productService.getProducts({ page: 1, limit: 12 }),
                productService.getCategories(),
            ]);
            setFeaturedProducts(productsRes.data);
            setCategories(categoriesRes);
        } catch (error) {
            console.error('Failed to load homepage data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    // Split products for different sections
    const saleProducts = featuredProducts.filter(p => p.discount_price && p.discount_price < p.price);
    const newProducts = featuredProducts.slice(0, 8);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Flash Sale Section */}
            <FlashSale products={saleProducts} />

            {/* Categories Showcase */}
            <CategoriesShowcase categories={categories} />

            {/* New Arrivals */}
            <NewArrivals products={newProducts} />

            {/* Features */}
            <Features />

            {/* Testimonials */}
            <Testimonials />
        </div>
    );
}