'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
    value: string;
    onSave: (value: string) => void;
    className?: string;
}

export function EditableText({ value, onSave, className }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim()) {
            onSave(editValue.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                <Input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleCancel}
                    className="h-6 text-xs"
                />
                <div
                    role="button"
                    tabIndex={0}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-accent cursor-pointer"
                >
                    <Check className="h-3 w-3 text-green-600" />
                </div>
                <div
                    role="button"
                    tabIndex={0}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleCancel();
                    }}
                    className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-accent cursor-pointer"
                >
                    <X className="h-3 w-3 text-red-600" />
                </div>
            </div>
        );
    }

    return (
        <span
            onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
            }}
            className={cn(
                'cursor-pointer hover:text-primary transition-colors truncate',
                className
            )}
        >
            {value}
        </span>
    );
}
