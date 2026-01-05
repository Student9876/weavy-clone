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
            inputType: 'upload',
        },
    },
    {
        id: "3",
        type: "llmNode",
        position: { x: 500, y: 100 },
        data: {
            label: "Gemini Processor",
            status: 'idle',
            model: 'gemini-2.5-flash',
            temperature: 0.7,
            outputs: [],
            viewMode: 'single',
        },
    },
];

// Initial Edges (Connections)
const initialEdges: Edge[] = [
    {
        id: 'e1-3',
        source: '1',
        target: '3',
        sourceHandle: null,
        targetHandle: 'user_message',
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        sourceHandle: null,
        targetHandle: 'images',
    },
];

export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            nodes: initialNodesData,
            edges: initialEdges, // Changed from []

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
                set({ nodes: initialNodesData, edges: initialEdges }); // Also changed here
            },

            addNode: (node: AppNode) => {
                set({
                    nodes: [...get().nodes, node],
                });
            }
        }),
        {
            name: 'workflow-storage',
            storage: createJSONStorage(() => localStorage),
            version: 2, // Increment version to clear old cache!

            migrate: (persistedState, version) => {
                if (version !== 2) {
                    return {
                        nodes: initialNodesData,
                        edges: initialEdges, // Changed here too
                    } as unknown as WorkflowState;
                }
                return persistedState as WorkflowState;
            },
        }
    )
);

