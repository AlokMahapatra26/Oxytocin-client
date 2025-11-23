'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface RawViewerProps {
    data: string;
}

export function RawViewer({ data }: RawViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <div className="absolute top-3 right-3 z-10">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-8"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3 mr-2" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
            <pre className="bg-muted p-4 overflow-auto max-h-[500px] text-sm font-mono whitespace-pre-wrap break-words">
                {data}
            </pre>
        </div>
    );
}
