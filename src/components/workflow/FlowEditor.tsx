"use client";

import React, {useCallback, useRef} from "react";
import {ReactFlow, Background, Controls, MiniMap, useReactFlow, ReactFlowProvider} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TextNode from "@/components/workflow/nodes/TextNode";
import ImageNode from "@/components/workflow/nodes/ImageNode";
import LLMNode from "@/components/workflow/nodes/LLMNode";
import {useWorkflowStore} from "@/store/workflowStore";
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

			// 1. FIXED: Correct Data Types matching types.ts exactly
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
				// LLM Node
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
					},
				};
			}

			addNode(newNode);
		},
		[screenToFlowPosition, addNode]
	);

	return (
		<div className="flex-1 relative h-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onDrop={onDrop}
				onDragOver={onDragOver}
				nodeTypes={nodeTypes}
				colorMode="dark"
				fitView>
				<Background color="#333" gap={20} size={1} />
				<Controls className="bg-[#1a1a1a] border-white/10 fill-white text-white" />
				<MiniMap className="bg-[#1a1a1a] border border-white/10" maskColor="rgba(0,0,0, 0.7)" nodeColor={() => "#dfff4f"} />
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
