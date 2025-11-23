import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HttpMethodBadgeProps {
    method: string;
    className?: string;
}

export function HttpMethodBadge({ method, className }: HttpMethodBadgeProps) {
    const getMethodStyles = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20';
            case 'POST':
                return 'bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20';
            case 'PUT':
                return 'bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20';
            case 'PATCH':
                return 'bg-purple-500/10 text-purple-700 border-purple-500/20 hover:bg-purple-500/20';
            case 'DELETE':
                return 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-700 border-gray-500/20 hover:bg-gray-500/20';
        }
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'font-mono text-[10px] px-1.5 py-0 h-5 font-semibold border',
                getMethodStyles(method),
                className
            )}
        >
            {method.toUpperCase()}
        </Badge>
    );
}
