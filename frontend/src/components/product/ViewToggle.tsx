'use client';

import { FiGrid, FiList } from 'react-icons/fi';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
    view: ViewMode;
    onChange: (view: ViewMode) => void;
    className?: string;
}

export default function ViewToggle({ view, onChange, className }: ViewToggleProps) {
    return (
        <div className={cn('flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden', className)}>
            <button
                onClick={() => onChange('grid')}
                className={cn(
                    'flex items-center justify-center w-10 h-10 transition-colors',
                    view === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
                aria-label="Grid view"
            >
                <FiGrid className="w-5 h-5" />
            </button>
            <button
                onClick={() => onChange('list')}
                className={cn(
                    'flex items-center justify-center w-10 h-10 transition-colors',
                    view === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
                aria-label="List view"
            >
                <FiList className="w-5 h-5" />
            </button>
        </div>
    );
}
