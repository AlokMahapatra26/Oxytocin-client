import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicAuthProps {
    username: string;
    password: string;
    onChange: (username: string, password: string) => void;
}

export function BasicAuth({ username, password, onChange }: BasicAuthProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="basic-username">Username</Label>
                <Input
                    id="basic-username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => onChange(e.target.value, password)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="basic-password">Password</Label>
                <Input
                    id="basic-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => onChange(username, e.target.value)}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Credentials will be sent as Base64 encoded Authorization header
            </p>
        </div>
    );
}
