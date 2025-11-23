export interface KeyValue {
    key: string;
    value: string;
    enabled: boolean;
}

export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey';

export interface AuthConfig {
    type: AuthType;
    bearer?: {
        token: string;
    };
    basic?: {
        username: string;
        password: string;
    };
    apikey?: {
        key: string;
        value: string;
        addTo: 'header' | 'query';
    };
}

export interface ApiRequest {
    id: string;
    name: string;
    method: string;
    url: string;
    headers: KeyValue[];
    queryParams: KeyValue[];
    body: string;
    bodyType: 'json' | 'raw';
    auth: AuthConfig;
}

export interface Folder {
    id: string;
    name: string;
    requests: ApiRequest[];
}

export interface Collection {
    id: string;
    name: string;
    folders: Folder[];
    requests: ApiRequest[];
}
