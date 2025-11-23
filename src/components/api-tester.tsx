'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useApiStore } from '@/store/api-store';
import { useStore } from '@/hooks/use-store';
import { ApiRequest, KeyValue } from '@/types';

interface ApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    duration: number;
}

export default function ApiTester() {
    // Use hydration-safe hook
    const collections = useStore(useApiStore, (state) => state.collections) ?? [];
    const addCollection = useApiStore((state) => state.addCollection);
    const addFolder = useApiStore((state) => state.addFolder);
    const addRequest = useApiStore((state) => state.addRequest);
    const deleteRequest = useApiStore((state) => state.deleteRequest);
    const renameCollection = useApiStore((state) => state.renameCollection);
    const renameFolder = useApiStore((state) => state.renameFolder);
    const renameRequest = useApiStore((state) => state.renameRequest);
    const updateRequest = useApiStore((state) => state.updateRequest);

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deleteCollection = useApiStore((state) => state.deleteCollection);
    const deleteFolder = useApiStore((state) => state.deleteFolder);

    const [queryParams, setQueryParams] = useState<KeyValue[]>([
        { key: '', value: '', enabled: true },
    ]);
    const [headers, setHeaders] = useState<KeyValue[]>([
        { key: '', value: '', enabled: true },
    ]);
    const [body, setBody] = useState('');
    const [bodyType, setBodyType] = useState<'json' | 'raw'>('json');

    const selectRequest = (request: any) => {
        setSelectedRequestId(request.id);
        setUrl(request.url);
        setMethod(request.method);
        setQueryParams(request.queryParams);
        setHeaders(request.headers);
        setBody(request.body);
        setBodyType(request.bodyType);
    };

    const saveCurrentRequest = () => {
        if (!selectedRequestId) return;

        // Find which collection/folder the request belongs to
        let targetCollectionId = '';
        let targetFolderId: string | undefined;
        let currentRequest: ApiRequest | undefined;

        collections.forEach((col) => {
            const inCollection = col.requests.find((r) => r.id === selectedRequestId);
            if (inCollection) {
                targetCollectionId = col.id;
                currentRequest = inCollection;
                return;
            }

            col.folders.forEach((folder) => {
                const inFolder = folder.requests.find((r) => r.id === selectedRequestId);
                if (inFolder) {
                    targetCollectionId = col.id;
                    targetFolderId = folder.id;
                    currentRequest = inFolder;
                }
            });
        });

        if (targetCollectionId && currentRequest) {
            // Only update name if it's still default or empty
            const shouldUpdateName =
                !currentRequest.name ||
                currentRequest.name === 'New Request' ||
                currentRequest.name === 'Untitled';

            updateRequest(
                targetCollectionId,
                selectedRequestId,
                {
                    url,
                    method,
                    queryParams,
                    headers,
                    body,
                    bodyType,
                    // Only update name to URL if it's still the default name
                    ...(shouldUpdateName && url && { name: url.split('?')[0].split('/').pop() || url }),
                },
                targetFolderId
            );
        }
    };


    const addRow = (
        type: 'params' | 'headers',
        setter: React.Dispatch<React.SetStateAction<KeyValue[]>>
    ) => {
        setter((prev) => [...prev, { key: '', value: '', enabled: true }]);
    };

    const updateRow = (
        index: number,
        field: keyof KeyValue,
        value: string | boolean,
        setter: React.Dispatch<React.SetStateAction<KeyValue[]>>
    ) => {
        setter((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const removeRow = (
        index: number,
        setter: React.Dispatch<React.SetStateAction<KeyValue[]>>
    ) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSendRequest = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        saveCurrentRequest();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const params: Record<string, string> = {};
            queryParams.forEach((param) => {
                if (param.enabled && param.key) {
                    params[param.key] = param.value;
                }
            });

            const requestHeaders: Record<string, string> = {};
            headers.forEach((header) => {
                if (header.enabled && header.key) {
                    requestHeaders[header.key] = header.value;
                }
            });

            let requestBody = null;
            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                try {
                    requestBody = bodyType === 'json' ? JSON.parse(body) : body;
                } catch {
                    setError('Invalid JSON in body');
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch('http://localhost:5000/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    method,
                    headers: requestHeaders,
                    params,
                    body: requestBody,
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
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar
                    collections={collections}
                    onAddCollection={addCollection}
                    onDeleteCollection={deleteCollection}
                    onAddFolder={addFolder}
                    onDeleteFolder={deleteFolder}
                    onAddRequest={addRequest}
                    onSelectRequest={selectRequest}
                    onDeleteRequest={deleteRequest}
                    onRenameCollection={renameCollection}
                    onRenameFolder={renameFolder}
                    onRenameRequest={renameRequest}
                    selectedRequestId={selectedRequestId}
                />

                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <SidebarTrigger />
                            <h1 className="text-3xl font-bold">API Tester</h1>
                        </div>

                        <div className="border border-border bg-card mb-6">
                            <div className="p-6">
                                <div className="flex gap-3 mb-6">
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

                                    <Button onClick={handleSendRequest} disabled={loading} className="px-8">
                                        {loading ? 'Sending...' : 'Send'}
                                    </Button>

                                    {selectedRequestId && (
                                        <Button onClick={saveCurrentRequest} variant="outline">
                                            Save
                                        </Button>
                                    )}
                                </div>

                                <Tabs defaultValue="params" className="w-full">
                                    <TabsList className="bg-muted">
                                        <TabsTrigger value="params">Query Params</TabsTrigger>
                                        <TabsTrigger value="headers">Headers</TabsTrigger>
                                        {['POST', 'PUT', 'PATCH'].includes(method) && (
                                            <TabsTrigger value="body">Body</TabsTrigger>
                                        )}
                                    </TabsList>

                                    <TabsContent value="params" className="mt-4">
                                        <div className="space-y-2">
                                            {queryParams.map((param, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={param.enabled}
                                                        onChange={(e) =>
                                                            updateRow(index, 'enabled', e.target.checked, setQueryParams)
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <Input
                                                        placeholder="Key"
                                                        value={param.key}
                                                        onChange={(e) =>
                                                            updateRow(index, 'key', e.target.value, setQueryParams)
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Value"
                                                        value={param.value}
                                                        onChange={(e) =>
                                                            updateRow(index, 'value', e.target.value, setQueryParams)
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeRow(index, setQueryParams)}
                                                        disabled={queryParams.length === 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addRow('params', setQueryParams)}
                                            >
                                                Add Param
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="headers" className="mt-4">
                                        <div className="space-y-2">
                                            {headers.map((header, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={header.enabled}
                                                        onChange={(e) =>
                                                            updateRow(index, 'enabled', e.target.checked, setHeaders)
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <Input
                                                        placeholder="Key"
                                                        value={header.key}
                                                        onChange={(e) =>
                                                            updateRow(index, 'key', e.target.value, setHeaders)
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Value"
                                                        value={header.value}
                                                        onChange={(e) =>
                                                            updateRow(index, 'value', e.target.value, setHeaders)
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeRow(index, setHeaders)}
                                                        disabled={headers.length === 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addRow('headers', setHeaders)}
                                            >
                                                Add Header
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {['POST', 'PUT', 'PATCH'].includes(method) && (
                                        <TabsContent value="body" className="mt-4">
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant={bodyType === 'json' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setBodyType('json')}
                                                    >
                                                        JSON
                                                    </Button>
                                                    <Button
                                                        variant={bodyType === 'raw' ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setBodyType('raw')}
                                                    >
                                                        Raw
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    placeholder={
                                                        bodyType === 'json'
                                                            ? '{\n  "key": "value"\n}'
                                                            : 'Enter raw body content'
                                                    }
                                                    value={body}
                                                    onChange={(e) => setBody(e.target.value)}
                                                    className="font-mono min-h-[200px]"
                                                />
                                            </div>
                                        </TabsContent>
                                    )}
                                </Tabs>
                            </div>
                        </div>

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
                                    <TabsList className="w-full justify-start bg-muted h-12">
                                        <TabsTrigger value="body">Body</TabsTrigger>
                                        <TabsTrigger value="headers">Headers</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="body" className="p-6">
                                        <pre className="bg-muted p-4 overflow-auto max-h-[500px] text-sm font-mono">
                                            {JSON.stringify(response.data, null, 2)}
                                        </pre>
                                    </TabsContent>

                                    <TabsContent value="headers" className="p-6">
                                        <pre className="bg-muted p-4 overflow-auto max-h-[500px] text-sm font-mono">
                                            {JSON.stringify(response.headers, null, 2)}
                                        </pre>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
