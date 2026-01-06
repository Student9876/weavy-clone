import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from "zundo";
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
    deleteNode: (id: string) => void;
};

// Initial Data - Empty canvas
const initialNodesData: AppNode[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<WorkflowState>()(
    temporal(

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
                    // Force the new connection to use our custom type
                    const edge = {
                        ...connection,
                        type: 'animatedEdge', // Matches the key we will define in FlowEditor
                        animated: true,       // Adds the "marching ants" animation automatically
                        style: { strokeWidth: 3 },
                    };

                    set({
                        edges: addEdge(edge, get().edges),
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
                },

                deleteNode: (id: string) => {
                    set((state) => ({
                        // 1. Remove the node
                        nodes: state.nodes.filter((node) => node.id !== id),
                        // 2. Remove any edges connected to this node
                        edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
                    }));
                },
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
        ),
        {
            // Keep last 100 states
            limit: 100,
            // This ensures we ONLY track data, not functions/actions.
            // Without this, Zundo tries to restore functions which corrupts the store.
            partialize: (state) => {
                const { nodes, edges } = state;
                return { nodes, edges };
            },
            // Equality: THIS is where we exclude position from TRIGGERING a save.
            // If the only difference between 'past' and 'current' is position/selection, we say "They are Equal" -> No Save.
            equality: (pastState, currentState) => {
                // Helper to strip out volatile properties (position, selection, dimensions)
                const stripVolatile = (state: Partial<WorkflowState>) => {
                    if (!state.nodes || !state.edges) return {};
                    return {
                        edges: state.edges, // Edges rarely change randomly, so we keep them full
                        nodes: state.nodes.map((node) => {
                            // Destructure out the fields we want to IGNORE during comparison
                            const { position, measured, selected, dragging, ...stableData } = node;
                            return stableData;
                        }),
                    };
                };

                // Compare the "Cleaned" versions
                return JSON.stringify(stripVolatile(pastState)) === JSON.stringify(stripVolatile(currentState));
            },
        }
    )
);

