'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    duration: number;
}

export default function ApiTester() {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendRequest = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch('http://localhost:5000/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    method,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data);
            } else {
                setError(data.error || 'Request failed');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-foreground"></h1>

                {/* Request Section */}
                <div className="border border-border bg-card mb-6">
                    <div className="p-6">
                        <div className="flex gap-3">
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                type="text"
                                placeholder="Enter request URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
                            />

                            <Button
                                onClick={handleSendRequest}
                                disabled={loading}
                                className="px-8"
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Response Section */}
                {error && (
                    <div className="border border-destructive bg-destructive/10 p-4 mb-6">
                        <p className="text-destructive font-medium">Error: {error}</p>
                    </div>
                )}

                {response && (
                    <div className="border border-border bg-card">
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span
                                    className={`font-semibold ${response.status >= 200 && response.status < 300
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}
                                >
                                    {response.status} {response.statusText}
                                </span>
                                <span className="text-sm text-muted-foreground ml-auto">
                                    Time: {response.duration}ms
                                </span>
                            </div>
                        </div>

                        <Tabs defaultValue="body" className="w-full">
                            <TabsList className="w-full justify-start border-b border-border bg-transparent h-12 rounded-none">
                                <TabsTrigger value="body" className="rounded-none">
                                    Body
                                </TabsTrigger>
                                <TabsTrigger value="headers" className="rounded-none">
                                    Headers
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="body" className="p-6">
                                <pre className="bg-muted p-4 overflow-auto max-h-[500px] text-sm">
                                    {JSON.stringify(response.data, null, 2)}
                                </pre>
                            </TabsContent>

                            <TabsContent value="headers" className="p-6">
                                <pre className="bg-muted p-4 overflow-auto max-h-[500px] text-sm">
                                    {JSON.stringify(response.headers, null, 2)}
                                </pre>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
}
