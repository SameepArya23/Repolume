import { create } from "zustand";

export type TabName = "overview" | "architecture" | "file" | "deps";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

interface RepoState {
    repoUrl: string | null;
    selectedFile: string | null;
    activeTab: TabName;
    chatHistory: ChatMessage[];
    sidebarOpen: boolean;

    // Actions
    setRepoUrl: (url: string) => void;
    setSelectedFile: (path: string | null) => void;
    setActiveTab: (tab: TabName) => void;
    addChatMessage: (msg: ChatMessage) => void;
    clearChat: () => void;
    toggleSidebar: () => void;
    reset: () => void;
}

export const useRepoStore = create<RepoState>((set) => ({
    repoUrl: null,
    selectedFile: null,
    activeTab: "overview",
    chatHistory: [],
    sidebarOpen: true,

    setRepoUrl: (url) => set({ repoUrl: url }),
    setSelectedFile: (path) =>
        set({ selectedFile: path, activeTab: path ? "file" : "overview" }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    addChatMessage: (msg) =>
        set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
    clearChat: () => set({ chatHistory: [] }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    reset: () =>
        set({
            repoUrl: null,
            selectedFile: null,
            activeTab: "overview",
            chatHistory: [],
            sidebarOpen: true,
        }),
}));
