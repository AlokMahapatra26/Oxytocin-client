import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BearerAuthProps {
    token: string;
    onChange: (token: string) => void;
}

export function BearerAuth({ token, onChange }: BearerAuthProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="bearer-token">Token</Label>
                <Input
                    id="bearer-token"
                    type="text"
                    placeholder="Enter bearer token"
                    value={token}
                    onChange={(e) => onChange(e.target.value)}
                    className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                    The token will be sent as: Authorization: Bearer {'<token>'}
                </p>
            </div>
        </div>
    );
}
