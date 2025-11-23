import { AuthType, AuthConfig } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BearerAuth } from './bearer-auth';
import { BasicAuth } from './basic-auth';
import { ApiKeyAuth } from './apikey-auth';

interface AuthPanelProps {
    auth: AuthConfig;
    onChange: (auth: AuthConfig) => void;
}

export function AuthPanel({ auth, onChange }: AuthPanelProps) {
    const handleTypeChange = (type: AuthType) => {
        onChange({
            type,
            bearer: type === 'bearer' ? { token: '' } : undefined,
            basic: type === 'basic' ? { username: '', password: '' } : undefined,
            apikey: type === 'apikey' ? { key: '', value: '', addTo: 'header' } : undefined,
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="auth-type">Authorization Type</Label>
                <Select value={auth.type} onValueChange={handleTypeChange}>
                    <SelectTrigger id="auth-type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {auth.type === 'bearer' && (
                <BearerAuth
                    token={auth.bearer?.token || ''}
                    onChange={(token) =>
                        onChange({ ...auth, bearer: { token } })
                    }
                />
            )}

            {auth.type === 'basic' && (
                <BasicAuth
                    username={auth.basic?.username || ''}
                    password={auth.basic?.password || ''}
                    onChange={(username, password) =>
                        onChange({ ...auth, basic: { username, password } })
                    }
                />
            )}

            {auth.type === 'apikey' && (
                <ApiKeyAuth
                    keyName={auth.apikey?.key || ''}
                    value={auth.apikey?.value || ''}
                    addTo={auth.apikey?.addTo || 'header'}
                    onChange={(key, value, addTo) =>
                        onChange({ ...auth, apikey: { key, value, addTo } })
                    }
                />
            )}
        </div>
    );
}
