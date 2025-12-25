'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/components/product/ProductList';
import Loading from '@/components/common/Loading';
import { productService } from '@/services/product.service';
import type { Product } from '@/types';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productService.getProducts({ page: 1, limit: 12 });
                setProducts(response.data);
            } catch (err: any) {
                setError('Không thể tải sản phẩm');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Sản phẩm</h1>
            <ProductList products={products} />
        </div>
    );
}
