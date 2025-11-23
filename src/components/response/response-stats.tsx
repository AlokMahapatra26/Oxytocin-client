import { Badge } from '@/components/ui/badge';
import { Clock, Database } from 'lucide-react';

interface ResponseStatsProps {
    status: number;
    statusText: string;
    duration: number;
    size?: number;
}

export function ResponseStats({ status, statusText, duration, size }: ResponseStatsProps) {
    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-600 bg-green-500/10 border-green-500/20';
        if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
        if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
        if (status >= 500) return 'text-red-600 bg-red-500/10 border-red-500/20';
        return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'N/A';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="outline" className={`font-semibold ${getStatusColor(status)}`}>
                    {status} {statusText}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                    <span className="text-muted-foreground">Time:</span>{' '}
                    <span className="font-semibold">{duration}ms</span>
                </span>
            </div>

            {size !== undefined && (
                <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        <span className="text-muted-foreground">Size:</span>{' '}
                        <span className="font-semibold">{formatSize(size)}</span>
                    </span>
                </div>
            )}
        </div>
    );
}
