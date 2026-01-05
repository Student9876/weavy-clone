import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
    Edge,
    EdgeChange,
    NodeChange,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from "@xyflow/react";

import { AppNode } from '@/lib/types';

type WorkflowState = {
    nodes: AppNode[];
    edges: Edge[];

    // Actions
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: (id: string, data: Partial<AppNode['data']>) => void;
    resetWorkflow: () => void;
    addNode: (node: AppNode) => void;
};

// Initial Data
const initialNodesData: AppNode[] = [
    {
        id: "1",
        type: "textNode",
        position: { x: 100, y: 100 },
        data: {
            label: "System Prompt",
            text: "You are a helpful AI assistant.",
            status: 'idle',
            isLocked: false,
        },
    },
    {
        id: "2",
        type: "imageNode",
        position: { x: 100, y: 350 },
        data: {
            label: "Product Image",
            status: 'idle',
            inputType: 'upload', // Required by ImageNodeData
        },
    },
    {
        id: "4",
        type: "imageNode",
        position: { x: 400, y: 350 },
        data: {
            label: "Product Image",
            status: 'idle',
            inputType: 'upload', // Required by ImageNodeData
        },
    },
    {
        id: "3",
        type: "llmNode",
        position: { x: 500, y: 100 },
        data: {
            label: "Gemini Processor",
            status: 'idle',
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            outputs: [],
            viewMode: 'single',
        },
    },
    {
        id: "5",
        type: "llmNode",
        position: { x: 500, y: 400 },
        data: {
            label: "Gemini Processor",
            status: 'idle',
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            outputs: [],
            viewMode: 'single',
        },
    },
];


export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            nodes: initialNodesData,
            edges: [],

            onNodesChange: (changes: NodeChange[]) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
                });
            },

            onEdgesChange: (changes: EdgeChange[]) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                });
            },

            onConnect: (connection: Connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                });
            },

            updateNodeData: (id: string, newData: Partial<AppNode['data']>) => {
                set({
                    nodes: get().nodes.map((node) => {
                        if (node.id === id) {
                            return {
                                ...node,
                                data: { ...node.data, ...newData },
                            };
                        }
                        return node;
                    }),
                });
            },

            resetWorkflow: () => {
                set({ nodes: initialNodesData, edges: [] });
            },

            addNode: (node: AppNode) => {
                set({
                    nodes: [...get().nodes, node],
                });
            }
        }),
        {
            name: 'workflow-storage', // unique name in localStorage
            storage: createJSONStorage(() => localStorage), // use browser local storage

            // Version Control
            version: 1, // Increment this number (e.g., to 2) whenever you change the data structure!

            // This function runs when the stored version doesn't match the current version
            migrate: (persistedState, version) => {
                if (version !== 1) {
                    // 🚀 FIX: Double cast to satisfy TypeScript
                    return {
                        nodes: initialNodesData,
                        edges: [],
                    } as unknown as WorkflowState;
                }
                return persistedState as WorkflowState;
            },
        }
    )
);

