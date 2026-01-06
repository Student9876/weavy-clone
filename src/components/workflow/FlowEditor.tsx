"use client";

import React, {useCallback, useRef, useEffect} from "react";
import {ReactFlow, Background, Controls, MiniMap, useReactFlow, ReactFlowProvider, Connection, getOutgoers, Edge, Panel} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextNode from "@/components/workflow/nodes/TextNode";
import ImageNode from "@/components/workflow/nodes/ImageNode";
import LLMNode from "@/components/workflow/nodes/LLMNode";
import {useWorkflowStore} from "@/store/workflowStore";
import UndoRedoControls from "./UndoRedoControls";
import {useStore} from "zustand";
import {AppNode} from "@/lib/types";

const nodeTypes = {
	textNode: TextNode,
	imageNode: ImageNode,
	llmNode: LLMNode,
};

// The internal content that uses useReactFlow
function FlowContent() {
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	const {nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode} = useWorkflowStore();
	const {screenToFlowPosition} = useReactFlow();
	const {undo, redo} = useStore(useWorkflowStore.temporal);

	// ------------------------------------------------------------------
	// 🔒 VALIDATION LOGIC (TYPE SAFETY + DAG/CYCLE PREVENTION)
	// ------------------------------------------------------------------
	const isValidConnection = useCallback(
		(connection: Edge | Connection) => {
			// 1. Self Connection Check
			if (connection.source === connection.target) return false;

			// Find Nodes
			const sourceNode = nodes.find((node) => node.id === connection.source);
			const targetNode = nodes.find((node) => node.id === connection.target);

			if (!sourceNode || !targetNode) return false;

			// ----------------------------------------------------------------
			// A. TYPE SAFETY CHECKS (Existing)
			// ----------------------------------------------------------------

			// Rule 1: Image Inputs -> Only Image Nodes
			if (connection.targetHandle?.startsWith("image")) {
				if (sourceNode.type !== "imageNode") return false;
			}

			// Rule 2: Prompt Inputs -> Only Text Producers
			if (connection.targetHandle === "prompt" || connection.targetHandle === "system-prompt") {
				const isTextProducer = sourceNode.type === "textNode" || sourceNode.type === "llmNode";
				if (!isTextProducer) return false;
			}

			// Rule 3: Generic input handles block image nodes
			if (connection.targetHandle === "input") {
				if (sourceNode.type === "imageNode") return false;
			}

			// ----------------------------------------------------------------
			// B. DAG / CYCLE DETECTION CHECK (New)
			// ----------------------------------------------------------------

			// We need to check if 'targetNode' can already reach 'sourceNode'.
			// If it can, connecting source->target would create a closed loop.

			const hasCycle = (node: AppNode, visited = new Set<string>()): boolean => {
				if (visited.has(node.id)) return false;
				visited.add(node.id);

				// 1. Check direct neighbors
				const outgoers = getOutgoers(node, nodes, edges);

				// 2. If any neighbor IS the source node, we found a cycle!
				if (outgoers.some((outgoer) => outgoer.id === sourceNode.id)) return true;

				// 3. Recursive check for neighbors' neighbors
				return outgoers.some((outgoer) => hasCycle(outgoer, visited));
			};

			// If a cycle is detected, block the connection
			if (hasCycle(targetNode)) return false;

			return true;
		},
		[nodes, edges]
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			const type = event.dataTransfer.getData("application/reactflow");
			if (!type) return;

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			const newNodeId = crypto.randomUUID();
			let newNode: AppNode;

			if (type === "textNode") {
				newNode = {
					id: newNodeId,
					type: "textNode",
					position,
					data: {label: "Text Input", text: "", status: "idle"},
				};
			} else if (type === "imageNode") {
				newNode = {
					id: newNodeId,
					type: "imageNode",
					position,
					data: {label: "Image Input", status: "idle", inputType: "upload"},
				};
			} else {
				newNode = {
					id: newNodeId,
					type: "llmNode",
					position,
					data: {
						label: "Gemini Worker",
						status: "idle",
						model: "gemini-2.5-flash",
						temperature: 0.7,
						viewMode: "single",
						outputs: [],
						imageHandleCount: 1, // Add this line
					},
				};
			}

			addNode(newNode);
		},
		[screenToFlowPosition, addNode]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Undo: Ctrl+Z or Cmd+Z
			if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				undo();
			}
			// Redo: Ctrl+Y or Cmd+Shift+Z
			if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
				e.preventDefault();
				redo();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [undo, redo]);

	return (
		<div className="flex-1 relative h-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				isValidConnection={isValidConnection}
				onDrop={onDrop}
				onDragOver={onDragOver}
				nodeTypes={nodeTypes}
				colorMode="dark"
				fitView>
				<Background color="#333" gap={20} size={1} />
				<Controls className="bg-[#1a1a1a] border-white/10 fill-white text-white" />
				<MiniMap className="bg-[#1a1a1a] border border-white/10" maskColor="rgba(0,0,0, 0.7)" nodeColor={() => "#dfff4f"} />
				{/* Undo/Redo Controls */}
				<Panel position="bottom-left" className="mb-12 ml-2">
					<UndoRedoControls />
				</Panel>
			</ReactFlow>
		</div>
	);
}

// Default export wrapper
export default function FlowEditor() {
	return (
		<ReactFlowProvider>
			<FlowContent />
		</ReactFlowProvider>
	);
}
