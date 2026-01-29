'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface SortOption {
    label: string;
    value: string;
}

interface SortDropdownProps {
    options: SortOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SortDropdown({ options, value, onChange, className }: SortDropdownProps) {
    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <Menu as="div" className={cn('relative', className)}>
            <Menu.Button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                <span className="text-gray-500">Sắp xếp:</span>
                <span className="text-gray-900">{selectedOption.label}</span>
                <FiChevronDown className="w-4 h-4 text-gray-400" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg border border-gray-100 focus:outline-none py-1">
                    {options.map((option) => (
                        <Menu.Item key={option.value}>
                            {({ active }) => (
                                <button
                                    onClick={() => onChange(option.value)}
                                    className={cn(
                                        'flex items-center justify-between w-full px-4 py-2.5 text-sm',
                                        active ? 'bg-gray-50' : '',
                                        value === option.value ? 'text-primary-600 font-medium' : 'text-gray-700'
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <FiCheck className="w-4 h-4 text-primary-600" />
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
