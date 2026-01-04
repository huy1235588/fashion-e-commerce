import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/lib/api';

export function useAuth() {
    const { user, token, isAuthenticated, isLoading, login, logout, setLoading, setUser } =
        useAuthStore();

    useEffect(() => {
        // Set token in API client when it changes
        if (token) {
            apiClient.setToken(token);
        } else {
            apiClient.clearToken();
        }
    }, [token]);

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            login(response.user, response.token);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (
        email: string,
        password: string,
        full_name: string,
        phone?: string
    ) => {
        try {
            setLoading(true);
            const response = await authService.register({ email, password, full_name, phone });
            login(response.user, response.token);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
        } catch (error) {
            console.error('Logout error:', error);
            logout();
        }
    };

    const refreshProfile = async () => {
        try {
            const updatedUser = await authService.getProfile();
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Refresh profile error:', error);
            throw error;
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshProfile,
        setUser,
    };
}
