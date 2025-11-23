'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface HeadersViewerProps {
    headers: Record<string, string>;
}

export function HeadersViewer({ headers }: HeadersViewerProps) {
    const headerEntries = Object.entries(headers);

    return (
        <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3 font-semibold">Header</TableHead>
                        <TableHead className="font-semibold">Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {headerEntries.map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell className="font-mono text-xs font-medium">{key}</TableCell>
                            <TableCell className="font-mono text-xs break-all">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
