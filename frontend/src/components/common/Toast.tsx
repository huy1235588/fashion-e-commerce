'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>,
        document.body
    );
}

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
    useEffect(() => {
        const duration = toast.duration || 5000;
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="w-5 h-5" />,
        error: <FiAlertCircle className="w-5 h-5" />,
        warning: <FiAlertTriangle className="w-5 h-5" />,
        info: <FiInfo className="w-5 h-5" />,
    };

    const styles = {
        success: 'bg-green-50 border-green-500 text-green-900',
        error: 'bg-red-50 border-red-500 text-red-900',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
        info: 'bg-blue-50 border-blue-500 text-blue-900',
    };

    return (
        <div
            className={`flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-lg border-l-4 shadow-lg animate-in slide-in-from-right ${styles[toast.type]}`}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close"
            >
                <FiX className="w-4 h-4" />
            </button>
        </div>
    );
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastList: Toast[] = [];

function notifyListeners() {
    toastListeners.forEach((listener) => listener([...toastList]));
}

export const toast = {
    show: (message: string, type: ToastType = 'info', duration?: number) => {
        const id = Math.random().toString(36).substr(2, 9);
        toastList.push({ id, message, type, duration });
        notifyListeners();
    },

    success: (message: string, duration?: number) => {
        toast.show(message, 'success', duration);
    },

    error: (message: string, duration?: number) => {
        toast.show(message, 'error', duration);
    },

    warning: (message: string, duration?: number) => {
        toast.show(message, 'warning', duration);
    },

    info: (message: string, duration?: number) => {
        toast.show(message, 'info', duration);
    },

    remove: (id: string) => {
        toastList = toastList.filter((t) => t.id !== id);
        notifyListeners();
    },
};

export function ToastProvider() {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        toastListeners.push(setToasts);
        return () => {
            toastListeners = toastListeners.filter((listener) => listener !== setToasts);
        };
    }, []);

    if (!mounted) return null;

    return <ToastContainer toasts={toasts} removeToast={toast.remove} />;
}
