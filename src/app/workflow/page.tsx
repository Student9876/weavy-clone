"use client";

import React, {useSyncExternalStore} from "react";
import {ReactFlow, Background, Controls, MiniMap} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "@/components/workflow/Sidebar";
import TextNode from "@/components/workflow/nodes/TextNode";
import ImageNode from "@/components/workflow/nodes/ImageNode"; // Don't forget this!
import LLMNode from "@/components/workflow/nodes/LLMNode";
import {useWorkflowStore} from "@/store/workflowStore";

const nodeTypes = {
	textNode: TextNode,
	imageNode: ImageNode,
	llmNode: LLMNode,
};

export default function EditorPage() {
	const {nodes, edges, onNodesChange, onEdgesChange, onConnect} = useWorkflowStore();

	// HYDRATION FIX: Only render React Flow after mounting on client
	const isMounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false
	);

	if (!isMounted) {
		return <div className="flex h-screen w-screen bg-[#0a0a0a] items-center justify-center text-white/20">Loading Workflow...</div>;
	}

	return (
		<div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
			<Sidebar />
			<div className="flex-1 relative h-full">
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
