'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import setCookieParser from 'set-cookie-parser';
import { Badge } from '@/components/ui/badge';

interface CookiesViewerProps {
    cookies: string[];
}

export function CookiesViewer({ cookies }: CookiesViewerProps) {
    if (!cookies || cookies.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No cookies received from this response</p>
            </div>
        );
    }

    // Parse cookies using set-cookie-parser
    const parsedCookies = setCookieParser.parse(cookies, { map: false });

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Value</TableHead>
                            <TableHead className="font-semibold">Domain</TableHead>
                            <TableHead className="font-semibold">Path</TableHead>
                            <TableHead className="font-semibold">Expires</TableHead>
                            <TableHead className="font-semibold">Flags</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedCookies.map((cookie, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono text-xs font-medium">
                                    {cookie.name}
                                </TableCell>
                                <TableCell className="font-mono text-xs max-w-xs truncate">
                                    {cookie.value}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {cookie.domain || '-'}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {cookie.path || '/'}
                                </TableCell>
                                <TableCell className="text-xs">
                                    {cookie.expires ? new Date(cookie.expires).toLocaleString() : 'Session'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {cookie.httpOnly && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                HttpOnly
                                            </Badge>
                                        )}
                                        {cookie.secure && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                Secure
                                            </Badge>
                                        )}
                                        {cookie.sameSite && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                SameSite: {cookie.sameSite}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
    );
}
