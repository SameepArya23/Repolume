import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatWithRepo } from "@/services/api";
import { useRepoStore } from "@/store/repoStore";
import type { ChatMessage } from "@/store/repoStore";

export function useChat() {
    const { repoUrl, chatHistory, addChatMessage, clearChat } = useRepoStore();
    const [inputValue, setInputValue] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: (question: string) => chatWithRepo(repoUrl!, question),
        onSuccess: (data, question) => {
            const assistantMsg: ChatMessage = {
                role: "assistant",
                content: data.answer,
                timestamp: Date.now(),
            };
            addChatMessage(assistantMsg);
        },
        onError: (err: Error) => {
            const errorMsg: ChatMessage = {
                role: "assistant",
                content: `⚠️ ${err.message}`,
                timestamp: Date.now(),
            };
            addChatMessage(errorMsg);
        },
    });

    const sendMessage = (message?: string) => {
        const text = (message ?? inputValue).trim();
        if (!text || !repoUrl || isPending) return;

        const userMsg: ChatMessage = {
            role: "user",
            content: text,
            timestamp: Date.now(),
        };
        addChatMessage(userMsg);
        setInputValue("");
        mutate(text);
    };

    return {
        messages: chatHistory,
        inputValue,
        setInputValue,
        sendMessage,
        isLoading: isPending,
        clearChat,
        canSend: !!repoUrl && !isPending,
    };
}
