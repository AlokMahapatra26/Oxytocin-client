import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ApiKeyAuthProps {
    keyName: string;
    value: string;
    addTo: 'header' | 'query';
    onChange: (keyName: string, value: string, addTo: 'header' | 'query') => void;
}

export function ApiKeyAuth({ keyName, value, addTo, onChange }: ApiKeyAuthProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="apikey-name">Key</Label>
                <Input
                    id="apikey-name"
                    type="text"
                    placeholder="e.g., X-API-Key"
                    value={keyName}
                    onChange={(e) => onChange(e.target.value, value, addTo)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="apikey-value">Value</Label>
                <Input
                    id="apikey-value"
                    type="text"
                    placeholder="Enter API key"
                    value={value}
                    onChange={(e) => onChange(keyName, e.target.value, addTo)}
                    className="font-mono"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="apikey-addto">Add to</Label>
                <Select value={addTo} onValueChange={(val) => onChange(keyName, value, val as 'header' | 'query')}>
                    <SelectTrigger id="apikey-addto">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="query">Query Params</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
