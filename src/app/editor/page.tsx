"use client";

import React from "react";
import {ReactFlow, Background, Controls} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; // Import base styles

// 1. Define initial dummy nodes just to test rendering
const initialNodes = [
	{
		id: "1",
		position: {x: 100, y: 100},
		data: {label: "Test Node 1"},
		style: {background: "#18181b", color: "#fff", border: "1px solid #27272a", padding: "10px", borderRadius: "8px"},
	},
	{
		id: "2",
		position: {x: 400, y: 100},
		data: {label: "Test Node 2"},
		style: {background: "#18181b", color: "#fff", border: "1px solid #27272a", padding: "10px", borderRadius: "8px"},
	},
];

const initialEdges = [{id: "e1-2", source: "1", target: "2", animated: true, style: {stroke: "#a855f7"}}];

export default function EditorPage() {
	return (
		// Full screen container
		<div style={{width: "100vw", height: "100vh", background: "#09090b"}}>
			<ReactFlow nodes={initialNodes} edges={initialEdges} colorMode="dark" fitView>
				{/* The Dot Grid Background */}
				<Background color="#27272a" gap={20} size={1} />

				{/* Basic Navigation Controls */}
				<Controls style={{fill: "#fff"}} />
			</ReactFlow>
		</div>
	);
}
