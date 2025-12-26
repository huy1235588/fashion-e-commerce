'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/');
        } else {
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}
