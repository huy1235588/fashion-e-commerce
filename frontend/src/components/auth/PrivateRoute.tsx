'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';

interface PrivateRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (requireAdmin && user?.role !== 'admin') {
                router.push('/');
                return;
            }
        }
    }, [isAuthenticated, user, isLoading, requireAdmin, router]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return null;
    }

    return <>{children}</>;
}
