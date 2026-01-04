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
        }),
        {
            name: 'workflow-storage', // unique name in localStorage
            storage: createJSONStorage(() => localStorage), // use browser local storage
        }
    )
);

