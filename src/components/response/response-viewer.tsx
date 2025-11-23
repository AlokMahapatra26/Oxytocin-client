import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseStats } from './response-stats';
import { JsonViewer } from './json-viewer';
import { RawViewer } from './raw-viewer';
import { HeadersViewer } from './headers-viewer';
import { TableViewer } from './table-viewer';
import { CookiesViewer } from './cookies-viewer';

interface ApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    duration: number;
    cookies?: string[];
}

interface ResponseViewerProps {
    response: ApiResponse;
}

export function ResponseViewer({ response }: ResponseViewerProps) {
    const dataString = typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data);

    const dataSize = new Blob([dataString]).size;

    const isTableCompatible = Array.isArray(response.data) ||
        (typeof response.data === 'object' && response.data !== null);

    const hasCookies = response.cookies && response.cookies.length > 0;

    return (
        <div className="border border-border bg-card flex flex-col h-full">
            <ResponseStats
                status={response.status}
                statusText={response.statusText}
                duration={response.duration}
                size={dataSize}
            />

            <Tabs defaultValue="pretty" className="w-full flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start border-b border-border bg-transparent h-12 rounded-none shrink-0">
                    <TabsTrigger value="pretty" className="rounded-none">
                        Pretty
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="rounded-none">
                        Raw
                    </TabsTrigger>
                    {isTableCompatible && (
                        <TabsTrigger value="table" className="rounded-none">
                            Table
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="headers" className="rounded-none">
                        Headers
                    </TabsTrigger>
                    <TabsTrigger value="cookies" className="rounded-none">
                        Cookies {hasCookies && `(${response.cookies?.length})`}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pretty" className="m-0 flex-1 overflow-hidden">
                    {typeof response.data === 'object' ? (
                        <JsonViewer data={response.data} />
                    ) : (
                        <RawViewer data={dataString} />
                    )}
                </TabsContent>

                <TabsContent value="raw" className="m-0 flex-1 overflow-hidden">
                    <RawViewer data={dataString} />
                </TabsContent>

                {isTableCompatible && (
                    <TabsContent value="table" className="m-0 flex-1 overflow-hidden">
                        <TableViewer data={response.data} />
                    </TabsContent>
                )}

                <TabsContent value="headers" className="m-0 flex-1 overflow-hidden">
                    <HeadersViewer headers={response.headers} />
                </TabsContent>

                <TabsContent value="cookies" className="m-0 flex-1 overflow-hidden">
                    <CookiesViewer cookies={response.cookies || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
