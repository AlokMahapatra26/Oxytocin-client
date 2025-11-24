const API_URL = 'http://localhost:5000/api';

let userHeaders = {};

export function setUserHeaders(userId: string, email: string, displayName: string | null) {
    userHeaders = {
        'x-user-id': userId,
        'x-user-email': email,
        'x-user-name': displayName || '',
    };
}

export async function fetchCollections() {
    const res = await fetch(`${API_URL}/collections`, { headers: userHeaders });
    return res.json();
}

export async function createCollection(name: string) {
    const res = await fetch(`${API_URL}/collections`, {
        method: 'POST',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return res.json();
}

export async function deleteCollection(id: string) {
    await fetch(`${API_URL}/collections/${id}`, {
        method: 'DELETE',
        headers: userHeaders,
    });
}

export async function renameCollection(id: string, name: string) {
    await fetch(`${API_URL}/collections/${id}`, {
        method: 'PATCH',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
}

export async function createFolder(collectionId: string, name: string) {
    const res = await fetch(`${API_URL}/folders`, {
        method: 'POST',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, name }),
    });
    return res.json();
}

export async function deleteFolder(id: string) {
    await fetch(`${API_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: userHeaders,
    });
}

export async function renameFolder(id: string, name: string) {
    await fetch(`${API_URL}/folders/${id}`, {
        method: 'PATCH',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
}

export async function createRequest(collectionId: string, folderId: string | null, requestData: any) {
    const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, folderId, ...requestData }),
    });
    return res.json();
}

export async function updateRequest(id: string, updates: any) {
    await fetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
}

export async function deleteRequest(id: string) {
    await fetch(`${API_URL}/requests/${id}`, {
        method: 'DELETE',
        headers: userHeaders,
    });
}

export async function renameRequest(id: string, name: string) {
    await fetch(`${API_URL}/requests/${id}/rename`, {
        method: 'PATCH',
        headers: { ...userHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
}
