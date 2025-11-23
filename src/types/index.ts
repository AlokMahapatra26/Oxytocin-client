export interface ApiRequest {
    id: string;
    name: string;
    method: string;
    url: string;
    headers: KeyValue[];
    queryParams: KeyValue[];
    body: string;
    bodyType: 'json' | 'raw';
}

export interface KeyValue {
    key: string;
    value: string;
    enabled: boolean;
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
