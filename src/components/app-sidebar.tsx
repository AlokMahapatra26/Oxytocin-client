'use client';

import { useState } from 'react';
import { Folder, FileText, Plus, Trash2, FolderPlus, MoreVertical, Edit, ChevronRight, ChevronDown } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HttpMethodBadge } from '@/components/http-method-badge';
import { Collection, Folder as FolderType, ApiRequest } from '@/types';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
    collections: Collection[];
    onAddCollection: () => void;
    onDeleteCollection: (collectionId: string) => void;
    onAddFolder: (collectionId: string) => void;
    onDeleteFolder: (collectionId: string, folderId: string) => void;
    onAddRequest: (collectionId: string, folderId?: string) => void;
    onSelectRequest: (request: ApiRequest) => void;
    onDeleteRequest: (collectionId: string, requestId: string, folderId?: string) => void;
    onRenameCollection: (collectionId: string, newName: string) => void;
    onRenameFolder: (collectionId: string, folderId: string, newName: string) => void;
    onRenameRequest: (collectionId: string, requestId: string, newName: string, folderId?: string) => void;
    selectedRequestId: string | null;
}

export function AppSidebar({
    collections,
    onAddCollection,
    onDeleteCollection,
    onAddFolder,
    onDeleteFolder,
    onAddRequest,
    onSelectRequest,
    onDeleteRequest,
    onRenameCollection,
    onRenameFolder,
    onRenameRequest,
    selectedRequestId,
}: AppSidebarProps) {
    const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [renamingItem, setRenamingItem] = useState<{
        type: 'collection' | 'folder' | 'request';
        id: string;
        collectionId?: string;
        folderId?: string;
    } | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const toggleCollection = (collectionId: string) => {
        setExpandedCollections((prev) => {
            const next = new Set(prev);
            if (next.has(collectionId)) {
                next.delete(collectionId);
            } else {
                next.add(collectionId);
            }
            return next;
        });
    };

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const startRename = (
        type: 'collection' | 'folder' | 'request',
        id: string,
        currentName: string,
        collectionId?: string,
        folderId?: string
    ) => {
        setRenamingItem({ type, id, collectionId, folderId });
        setRenameValue(currentName);
    };

    const handleRename = () => {
        if (!renamingItem || !renameValue.trim()) {
            setRenamingItem(null);
            return;
        }

        if (renamingItem.type === 'collection') {
            onRenameCollection(renamingItem.id, renameValue.trim());
        } else if (renamingItem.type === 'folder' && renamingItem.collectionId) {
            onRenameFolder(renamingItem.collectionId, renamingItem.id, renameValue.trim());
        } else if (renamingItem.type === 'request' && renamingItem.collectionId) {
            onRenameRequest(
                renamingItem.collectionId,
                renamingItem.id,
                renameValue.trim(),
                renamingItem.folderId
            );
        }

        setRenamingItem(null);
        setRenameValue('');
    };

    const cancelRename = () => {
        setRenamingItem(null);
        setRenameValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            cancelRename();
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Collections</h2>
                    <Button size="sm" onClick={onAddCollection}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {collections.map((collection) => {
                    const isExpanded = expandedCollections.has(collection.id);
                    return (
                        <Collapsible
                            key={collection.id}
                            open={isExpanded}
                            onOpenChange={() => toggleCollection(collection.id)}
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel className="flex items-center justify-between gap-2 group">
                                    <CollapsibleTrigger className="flex items-center gap-2 flex-1 hover:text-primary transition-colors">
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4 shrink-0" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 shrink-0" />
                                        )}
                                        {renamingItem?.type === 'collection' && renamingItem.id === collection.id ? (
                                            <Input
                                                value={renameValue}
                                                onChange={(e) => setRenameValue(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                onBlur={handleRename}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                                className="h-6 text-xs"
                                            />
                                        ) : (
                                            <span className="flex-1 truncate">{collection.name}</span>
                                        )}
                                    </CollapsibleTrigger>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className={cn(
                                                    'inline-flex items-center justify-center shrink-0',
                                                    'h-6 w-6 rounded-md',
                                                    'opacity-0 group-hover:opacity-100',
                                                    'hover:bg-accent hover:text-accent-foreground',
                                                    'transition-all'
                                                )}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => startRename('collection', collection.id, collection.name)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onAddFolder(collection.id)}>
                                                <FolderPlus className="h-4 w-4 mr-2" />
                                                Add Folder
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onAddRequest(collection.id)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Request
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onDeleteCollection(collection.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Collection
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarGroupLabel>

                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {/* Collection-level requests */}
                                            {collection.requests.map((request) => (
                                                <SidebarMenuItem key={request.id}>
                                                    <div className="relative group flex items-center">
                                                        <SidebarMenuButton
                                                            onClick={() => onSelectRequest(request)}
                                                            isActive={selectedRequestId === request.id}
                                                            className="flex-1"
                                                        >
                                                            <HttpMethodBadge method={request.method} className="shrink-0" />
                                                            {renamingItem?.type === 'request' &&
                                                                renamingItem.id === request.id &&
                                                                !renamingItem.folderId ? (
                                                                <Input
                                                                    value={renameValue}
                                                                    onChange={(e) => setRenameValue(e.target.value)}
                                                                    onKeyDown={handleKeyDown}
                                                                    onBlur={handleRename}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    autoFocus
                                                                    className="h-6 text-xs"
                                                                />
                                                            ) : (
                                                                <span className="text-xs truncate">{request.name}</span>
                                                            )}
                                                        </SidebarMenuButton>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    className={cn(
                                                                        'inline-flex items-center justify-center shrink-0',
                                                                        'h-6 w-6 rounded-md mr-2',
                                                                        'opacity-0 group-hover:opacity-100',
                                                                        'hover:bg-accent hover:text-accent-foreground',
                                                                        'transition-all'
                                                                    )}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <MoreVertical className="h-3 w-3" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        startRename('request', request.id, request.name, collection.id)
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Rename
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => onDeleteRequest(collection.id, request.id)}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </SidebarMenuItem>
                                            ))}

                                            {/* Folders */}
                                            {collection.folders.map((folder) => {
                                                const isFolderExpanded = expandedFolders.has(folder.id);
                                                return (
                                                    <SidebarMenuItem key={folder.id}>
                                                        <Collapsible
                                                            open={isFolderExpanded}
                                                            onOpenChange={() => toggleFolder(folder.id)}
                                                        >
                                                            <div className="ml-2">
                                                                <div className="flex items-center justify-between py-2 px-2 gap-2 group">
                                                                    <CollapsibleTrigger className="flex items-center gap-2 flex-1 hover:text-primary transition-colors">
                                                                        {isFolderExpanded ? (
                                                                            <ChevronDown className="h-3 w-3 shrink-0" />
                                                                        ) : (
                                                                            <ChevronRight className="h-3 w-3 shrink-0" />
                                                                        )}
                                                                        <Folder className="h-4 w-4 shrink-0" />
                                                                        {renamingItem?.type === 'folder' &&
                                                                            renamingItem.id === folder.id ? (
                                                                            <Input
                                                                                value={renameValue}
                                                                                onChange={(e) => setRenameValue(e.target.value)}
                                                                                onKeyDown={handleKeyDown}
                                                                                onBlur={handleRename}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                autoFocus
                                                                                className="h-6 text-xs"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-xs font-medium truncate">
                                                                                {folder.name}
                                                                            </span>
                                                                        )}
                                                                    </CollapsibleTrigger>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <button
                                                                                className={cn(
                                                                                    'inline-flex items-center justify-center shrink-0',
                                                                                    'h-6 w-6 rounded-md',
                                                                                    'opacity-0 group-hover:opacity-100',
                                                                                    'hover:bg-accent hover:text-accent-foreground',
                                                                                    'transition-all'
                                                                                )}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <MoreVertical className="h-3 w-3" />
                                                                            </button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    startRename('folder', folder.id, folder.name, collection.id)
                                                                                }
                                                                            >
                                                                                <Edit className="h-4 w-4 mr-2" />
                                                                                Rename
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                onClick={() => onAddRequest(collection.id, folder.id)}
                                                                            >
                                                                                <Plus className="h-4 w-4 mr-2" />
                                                                                Add Request
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                onClick={() => onDeleteFolder(collection.id, folder.id)}
                                                                                className="text-destructive"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                Delete Folder
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                                <CollapsibleContent>
                                                                    {folder.requests.map((request) => (
                                                                        <div
                                                                            key={request.id}
                                                                            className="relative group ml-4 flex items-center"
                                                                        >
                                                                            <SidebarMenuButton
                                                                                onClick={() => onSelectRequest(request)}
                                                                                isActive={selectedRequestId === request.id}
                                                                                className="flex-1"
                                                                            >
                                                                                <HttpMethodBadge method={request.method} className="shrink-0" />
                                                                                {renamingItem?.type === 'request' &&
                                                                                    renamingItem.id === request.id &&
                                                                                    renamingItem.folderId === folder.id ? (
                                                                                    <Input
                                                                                        value={renameValue}
                                                                                        onChange={(e) => setRenameValue(e.target.value)}
                                                                                        onKeyDown={handleKeyDown}
                                                                                        onBlur={handleRename}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        autoFocus
                                                                                        className="h-6 text-xs"
                                                                                    />
                                                                                ) : (
                                                                                    <span className="text-xs truncate">{request.name}</span>
                                                                                )}
                                                                            </SidebarMenuButton>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <button
                                                                                        className={cn(
                                                                                            'inline-flex items-center justify-center shrink-0',
                                                                                            'h-6 w-6 rounded-md mr-2',
                                                                                            'opacity-0 group-hover:opacity-100',
                                                                                            'hover:bg-accent hover:text-accent-foreground',
                                                                                            'transition-all'
                                                                                        )}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        <MoreVertical className="h-3 w-3" />
                                                                                    </button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                            startRename(
                                                                                                'request',
                                                                                                request.id,
                                                                                                request.name,
                                                                                                collection.id,
                                                                                                folder.id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                                        Rename
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem
                                                                                        onClick={() =>
                                                                                            onDeleteRequest(collection.id, request.id, folder.id)
                                                                                        }
                                                                                        className="text-destructive"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    ))}
                                                                </CollapsibleContent>
                                                            </div>
                                                        </Collapsible>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    );
                })}
            </SidebarContent>
        </Sidebar>
    );
}
