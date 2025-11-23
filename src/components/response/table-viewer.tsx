'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableViewerProps {
    data: any;
}

export function TableViewer({ data }: TableViewerProps) {
    // If data is not an array, convert to array
    const tableData = Array.isArray(data) ? data : [data];

    // Get all unique keys from all objects
    const allKeys = tableData.reduce((keys: Set<string>, item) => {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => keys.add(key));
        }
        return keys;
    }, new Set<string>());

    const columns = Array.from(allKeys);

    // Handle primitive values
    if (tableData.length === 1 && typeof tableData[0] !== 'object') {
        return (
            <div className="p-4">
                <div className="text-sm text-muted-foreground">
                    Cannot display primitive value as table. Use Pretty or Raw view.
                </div>
            </div>
        );
    }

    const renderCellValue = (value: any): string => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column} className="font-semibold whitespace-nowrap">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column} className="font-mono text-xs max-w-xs truncate">
                                        {renderCellValue(row[column])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
    );
}
