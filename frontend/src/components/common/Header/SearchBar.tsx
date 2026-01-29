'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    className?: string;
    onSearch?: (query: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function SearchBar({ 
    className, 
    onSearch,
    placeholder = "Tìm kiếm sản phẩm...",
    autoFocus = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Mock suggestions - in real app, this would come from API
    const mockSuggestions = [
        'Áo thun nam',
        'Áo sơ mi',
        'Quần jean',
        'Váy đầm',
        'Túi xách',
        'Giày sneaker',
    ];

    useEffect(() => {
        if (query.length > 0) {
            const filtered = mockSuggestions.filter(s => 
                s.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
            setQuery('');
            setSuggestions([]);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        router.push(`/products?search=${encodeURIComponent(suggestion)}`);
        setQuery('');
        setSuggestions([]);
    };

    const clearQuery = () => {
        setQuery('');
        setSuggestions([]);
        inputRef.current?.focus();
    };

    return (
        <div className={cn('relative', className)}>
            <form onSubmit={handleSubmit} className="relative">
                <div className={cn(
                    'flex items-center bg-gray-100 rounded-full transition-all duration-200',
                    isFocused && 'bg-white ring-2 ring-primary-500 shadow-lg'
                )}>
                    <FiSearch className="ml-4 text-gray-400 h-5 w-5 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearQuery}
                            className="mr-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="mr-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-full hover:bg-primary-700 transition-colors"
                    >
                        Tìm
                    </button>
                </div>
            </form>

            {/* Suggestions dropdown */}
            {isFocused && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-dropdown">
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <FiSearch className="h-4 w-4 text-gray-400" />
                                    <span>{suggestion}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
