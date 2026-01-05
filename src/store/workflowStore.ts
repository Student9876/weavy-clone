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

// Initial Data - Empty canvas
const initialNodesData: AppNode[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            nodes: initialNodesData,
            edges: initialEdges,

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
                set({ nodes: initialNodesData, edges: initialEdges });
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
            version: 3, // Incremented to clear old cached nodes

            migrate: (persistedState, version) => {
                if (version !== 3) {
                    return {
                        nodes: initialNodesData,
                        edges: initialEdges,
                    } as unknown as WorkflowState;
                }
                return persistedState as WorkflowState;
            },
        }
    )
);

