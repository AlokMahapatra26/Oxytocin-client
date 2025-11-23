import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Collection, ApiRequest } from '@/types';

interface ApiStore {
    collections: Collection[];
    addCollection: () => void;
    deleteCollection: (collectionId: string) => void;
    addFolder: (collectionId: string) => void;
    deleteFolder: (collectionId: string, folderId: string) => void;
    addRequest: (collectionId: string, folderId?: string) => void;
    deleteRequest: (collectionId: string, requestId: string, folderId?: string) => void;
    renameCollection: (collectionId: string, newName: string) => void;
    renameFolder: (collectionId: string, folderId: string, newName: string) => void;
    renameRequest: (collectionId: string, requestId: string, newName: string, folderId?: string) => void;
    updateRequest: (collectionId: string, requestId: string, updates: Partial<ApiRequest>, folderId?: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useApiStore = create<ApiStore>()(
    persist(
        (set) => ({
            collections: [],

            addCollection: () =>
                set((state) => ({
                    collections: [
                        ...state.collections,
                        {
                            id: generateId(),
                            name: `Collection ${state.collections.length + 1}`,
                            folders: [],
                            requests: [],
                        },
                    ],
                })),

            deleteCollection: (collectionId) =>
                set((state) => ({
                    collections: state.collections.filter((col) => col.id !== collectionId),
                })),

            addFolder: (collectionId) =>
                set((state) => ({
                    collections: state.collections.map((col) =>
                        col.id === collectionId
                            ? {
                                ...col,
                                folders: [
                                    ...col.folders,
                                    {
                                        id: generateId(),
                                        name: `Folder ${col.folders.length + 1}`,
                                        requests: [],
                                    },
                                ],
                            }
                            : col
                    ),
                })),

            deleteFolder: (collectionId, folderId) =>
                set((state) => ({
                    collections: state.collections.map((col) =>
                        col.id === collectionId
                            ? {
                                ...col,
                                folders: col.folders.filter((folder) => folder.id !== folderId),
                            }
                            : col
                    ),
                })),

            addRequest: (collectionId, folderId) =>
                set((state) => {
                    const newRequest: ApiRequest = {
                        id: generateId(),
                        name: 'New Request',
                        method: 'GET',
                        url: '',
                        headers: [{ key: '', value: '', enabled: true }],
                        queryParams: [{ key: '', value: '', enabled: true }],
                        body: '',
                        bodyType: 'json',
                    };

                    return {
                        collections: state.collections.map((col) => {
                            if (col.id === collectionId) {
                                if (folderId) {
                                    return {
                                        ...col,
                                        folders: col.folders.map((folder) =>
                                            folder.id === folderId
                                                ? { ...folder, requests: [...folder.requests, newRequest] }
                                                : folder
                                        ),
                                    };
                                } else {
                                    return { ...col, requests: [...col.requests, newRequest] };
                                }
                            }
                            return col;
                        }),
                    };
                }),

            deleteRequest: (collectionId, requestId, folderId) =>
                set((state) => ({
                    collections: state.collections.map((col) => {
                        if (col.id === collectionId) {
                            if (folderId) {
                                return {
                                    ...col,
                                    folders: col.folders.map((folder) =>
                                        folder.id === folderId
                                            ? { ...folder, requests: folder.requests.filter((r) => r.id !== requestId) }
                                            : folder
                                    ),
                                };
                            } else {
                                return { ...col, requests: col.requests.filter((r) => r.id !== requestId) };
                            }
                        }
                        return col;
                    }),
                })),

            renameCollection: (collectionId, newName) =>
                set((state) => ({
                    collections: state.collections.map((col) =>
                        col.id === collectionId ? { ...col, name: newName } : col
                    ),
                })),

            renameFolder: (collectionId, folderId, newName) =>
                set((state) => ({
                    collections: state.collections.map((col) =>
                        col.id === collectionId
                            ? {
                                ...col,
                                folders: col.folders.map((folder) =>
                                    folder.id === folderId ? { ...folder, name: newName } : folder
                                ),
                            }
                            : col
                    ),
                })),

            renameRequest: (collectionId, requestId, newName, folderId) =>
                set((state) => ({
                    collections: state.collections.map((col) => {
                        if (col.id === collectionId) {
                            if (folderId) {
                                return {
                                    ...col,
                                    folders: col.folders.map((folder) =>
                                        folder.id === folderId
                                            ? {
                                                ...folder,
                                                requests: folder.requests.map((req) =>
                                                    req.id === requestId ? { ...req, name: newName } : req
                                                ),
                                            }
                                            : folder
                                    ),
                                };
                            } else {
                                return {
                                    ...col,
                                    requests: col.requests.map((req) =>
                                        req.id === requestId ? { ...req, name: newName } : req
                                    ),
                                };
                            }
                        }
                        return col;
                    }),
                })),

            updateRequest: (collectionId, requestId, updates, folderId) =>
                set((state) => ({
                    collections: state.collections.map((col) => {
                        if (col.id === collectionId) {
                            if (folderId) {
                                return {
                                    ...col,
                                    folders: col.folders.map((folder) =>
                                        folder.id === folderId
                                            ? {
                                                ...folder,
                                                requests: folder.requests.map((req) =>
                                                    req.id === requestId ? { ...req, ...updates } : req
                                                ),
                                            }
                                            : folder
                                    ),
                                };
                            } else {
                                return {
                                    ...col,
                                    requests: col.requests.map((req) =>
                                        req.id === requestId ? { ...req, ...updates } : req
                                    ),
                                };
                            }
                        }
                        return col;
                    }),
                })),
        }),
        {
            name: 'api-tester-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
