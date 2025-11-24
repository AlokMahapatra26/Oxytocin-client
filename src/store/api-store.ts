import { create } from 'zustand';
import { Collection, ApiRequest } from '@/types';
import * as apiClient from '@/lib/api-client';

interface ApiStore {
    collections: Collection[];
    isLoading: boolean;
    selectedRequestId: string | null;

    // Actions
    loadCollections: () => Promise<void>;
    addCollection: () => Promise<void>;
    deleteCollection: (collectionId: string) => Promise<void>;
    renameCollection: (collectionId: string, newName: string) => Promise<void>;

    addFolder: (collectionId: string) => Promise<void>;
    deleteFolder: (collectionId: string, folderId: string) => Promise<void>;
    renameFolder: (collectionId: string, folderId: string, newName: string) => Promise<void>;

    addRequest: (collectionId: string, folderId?: string) => Promise<void>;
    deleteRequest: (collectionId: string, requestId: string, folderId?: string) => Promise<void>;
    renameRequest: (collectionId: string, requestId: string, newName: string, folderId?: string) => Promise<void>;
    updateRequest: (collectionId: string, requestId: string, updates: Partial<ApiRequest>, folderId?: string) => Promise<void>;

    setSelectedRequest: (requestId: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useApiStore = create<ApiStore>((set, get) => ({
    collections: [],
    isLoading: false,
    selectedRequestId: null,

    loadCollections: async () => {
        set({ isLoading: true });
        try {
            const data = await apiClient.fetchCollections();
            set({ collections: data, isLoading: false });
        } catch (error) {
            console.error('Error loading collections:', error);
            set({ isLoading: false });
        }
    },

    addCollection: async () => {
        const collections = get().collections;
        const name = `Collection ${collections.length + 1}`;
        const newCollection = await apiClient.createCollection(name);
        set({ collections: [...collections, newCollection] });
    },

    deleteCollection: async (collectionId: string) => {
        await apiClient.deleteCollection(collectionId);
        set({ collections: get().collections.filter(c => c.id !== collectionId) });
    },

    renameCollection: async (collectionId: string, newName: string) => {
        await apiClient.renameCollection(collectionId, newName);
        set({
            collections: get().collections.map(c =>
                c.id === collectionId ? { ...c, name: newName } : c
            ),
        });
    },

    addFolder: async (collectionId: string) => {
        const collection = get().collections.find(c => c.id === collectionId);
        const name = `Folder ${(collection?.folders.length || 0) + 1}`;
        const newFolder = await apiClient.createFolder(collectionId, name);

        set({
            collections: get().collections.map(c =>
                c.id === collectionId
                    ? { ...c, folders: [...c.folders, newFolder] }
                    : c
            ),
        });
    },

    deleteFolder: async (collectionId: string, folderId: string) => {
        await apiClient.deleteFolder(folderId);
        set({
            collections: get().collections.map(c =>
                c.id === collectionId
                    ? { ...c, folders: c.folders.filter(f => f.id !== folderId) }
                    : c
            ),
        });
    },

    renameFolder: async (collectionId: string, folderId: string, newName: string) => {
        await apiClient.renameFolder(folderId, newName);
        set({
            collections: get().collections.map(c =>
                c.id === collectionId
                    ? {
                        ...c,
                        folders: c.folders.map(f =>
                            f.id === folderId ? { ...f, name: newName } : f
                        ),
                    }
                    : c
            ),
        });
    },

    addRequest: async (collectionId: string, folderId?: string) => {
        const requestData = {
            name: 'New Request',
            method: 'GET',
            url: '',
            headers: [{ key: '', value: '', enabled: true }],
            queryParams: [{ key: '', value: '', enabled: true }],
            body: '',
            bodyType: 'json',
            auth: { type: 'none' },
        };

        const newRequest = await apiClient.createRequest(collectionId, folderId || null, requestData);

        set({
            collections: get().collections.map(c => {
                if (c.id === collectionId) {
                    if (folderId) {
                        return {
                            ...c,
                            folders: c.folders.map(f =>
                                f.id === folderId
                                    ? { ...f, requests: [...f.requests, newRequest] }
                                    : f
                            ),
                        };
                    } else {
                        return { ...c, requests: [...c.requests, newRequest] };
                    }
                }
                return c;
            }),
        });
    },

    deleteRequest: async (collectionId: string, requestId: string, folderId?: string) => {
        await apiClient.deleteRequest(requestId);

        set({
            collections: get().collections.map(c => {
                if (c.id === collectionId) {
                    if (folderId) {
                        return {
                            ...c,
                            folders: c.folders.map(f =>
                                f.id === folderId
                                    ? { ...f, requests: f.requests.filter(r => r.id !== requestId) }
                                    : f
                            ),
                        };
                    } else {
                        return { ...c, requests: c.requests.filter(r => r.id !== requestId) };
                    }
                }
                return c;
            }),
        });
    },

    renameRequest: async (collectionId: string, requestId: string, newName: string, folderId?: string) => {
        await apiClient.renameRequest(requestId, newName);

        set({
            collections: get().collections.map(c => {
                if (c.id === collectionId) {
                    if (folderId) {
                        return {
                            ...c,
                            folders: c.folders.map(f =>
                                f.id === folderId
                                    ? {
                                        ...f,
                                        requests: f.requests.map(r =>
                                            r.id === requestId ? { ...r, name: newName } : r
                                        ),
                                    }
                                    : f
                            ),
                        };
                    } else {
                        return {
                            ...c,
                            requests: c.requests.map(r =>
                                r.id === requestId ? { ...r, name: newName } : r
                            ),
                        };
                    }
                }
                return c;
            }),
        });
    },

    updateRequest: async (collectionId: string, requestId: string, updates: Partial<ApiRequest>, folderId?: string) => {
        await apiClient.updateRequest(requestId, updates);

        set({
            collections: get().collections.map(c => {
                if (c.id === collectionId) {
                    if (folderId) {
                        return {
                            ...c,
                            folders: c.folders.map(f =>
                                f.id === folderId
                                    ? {
                                        ...f,
                                        requests: f.requests.map(r =>
                                            r.id === requestId ? { ...r, ...updates } : r
                                        ),
                                    }
                                    : f
                            ),
                        };
                    } else {
                        return {
                            ...c,
                            requests: c.requests.map(r =>
                                r.id === requestId ? { ...r, ...updates } : r
                            ),
                        };
                    }
                }
                return c;
            }),
        });
    },

    setSelectedRequest: (requestId: string | null) => {
        set({ selectedRequestId: requestId });
    },
}));
