'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
    data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative h-full">
            <div className="absolute top-3 right-3 z-10">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-8 bg-background"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3 mr-2" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3 mr-2" />
                        </>
                    )}
                </Button>
            </div>
            <SyntaxHighlighter
                language="json"
                style={vs}
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '13px',
                    backgroundColor: 'transparent',
                    height: '100%',
                    overflow: 'auto',
                }}
                showLineNumbers
            >
                {JSON.stringify(data, null, 2)}
            </SyntaxHighlighter>
        </div>
    );
}
