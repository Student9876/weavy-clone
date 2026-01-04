"use client";

import React, {useCallback, useRef} from "react";
import {ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection, Edge} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "@/components/workflow/Sidebar";
import TextNode from "@/components/workflow/nodes/TextNode";
import {AppNode} from "@/lib/types"; // Updated import

const nodeTypes = {
	textNode: TextNode,
	// We will add imageNode and llmNode here soon
};

// INITIAL NODES MUST MATCH YOUR NEW TYPE DEFINITION
const initialNodes: AppNode[] = [
	{
		id: "1",
		type: "textNode",
		position: {x: 100, y: 100},
		data: {
			label: "System Prompt",
			text: "You are a helpful AI assistant.",
			status: "idle", // Required by BaseNodeData
			isLocked: false,
		},
	},
	{
		id: "2",
		type: "textNode",
		position: {x: 500, y: 150},
		data: {
			label: "User Input",
			text: "Explain quantum computing like I'm 5.",
			status: "success", // Example of success state
			isLocked: false,
		},
	},
];

const initialEdges: Edge[] = [];

export default function EditorPage() {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const reactFlowWrapper = useRef<HTMLDivElement>(null);

	const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	return (
		<div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
			<Sidebar />
			<div className="flex-1 relative h-full" ref={reactFlowWrapper}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					colorMode="dark"
					fitView>
					<Background color="#333" gap={20} size={1} />
					<Controls className="bg-[#1a1a1a] border-white/10 fill-white text-white" />
					<MiniMap className="bg-[#1a1a1a] border border-white/10" maskColor="rgba(0,0,0, 0.7)" nodeColor={() => "#dfff4f"} />
				</ReactFlow>
			</div>
		</div>
	);
}
