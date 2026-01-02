"use client";

import {ReactFlow, useNodesState, useEdgesState, Background, Handle, Position, NodeProps, BaseEdge, EdgeProps, getBezierPath} from "@xyflow/react";
import type {HeroNode} from "@/lib/types";
import "@xyflow/react/dist/style.css";
import Image from "next/image";

// --- 1. CUSTOM NODE (Polymorphic Sizing) ---
const MarketingCardNode = ({data}: NodeProps<HeroNode>) => {
	// Now TypeScript knows 'data' has width, height, label, etc.
	const width = data.width || "w-64";
	const height = data.height || "aspect-[4/5]";

	return (
		<div
			className={`relative group bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-black/5 p-1.5 transition-shadow hover:shadow-2xl ${width}`}>
			{/* Safe Conditional Rendering */}
			{data.label && (
				<div className="px-4 py-3 flex justify-between items-center text-[10px] font-mono text-black/40 uppercase tracking-widest">
					<span>{data.type}</span>
					<span className="text-black/80 font-bold">{data.label}</span>
				</div>
			)}

			{/* Node Content */}
			<div className={`relative w-full ${height} bg-zinc-50 rounded-2xl overflow-hidden`}>
				{data.image ? (
					<Image src={data.image} alt="node content" fill className="object-cover pointer-events-none" />
				) : data.text ? (
					<div className="p-6 flex items-center justify-center h-full text-center bg-white">
						<p className="text-[11px] leading-relaxed font-medium text-black/60">{data.text}</p>
					</div>
				) : (
					/* For Color Reference Gradient */
					<div className={`w-full h-full ${data.gradientClass}`} />
				)}
			</div>

			{/* Connection Handles (Fixed Tailwind syntax w-3!) */}
			<Handle type="target" position={Position.Left} className="w-3! h-3! bg-white! border-[1.5px]! border-black/10! shadow-sm" style={{left: "-6px"}} />
			<Handle
				type="source"
				position={Position.Right}
				className="w-3! h-3! bg-white! border-[1.5px]! border-black/10! shadow-sm"
				style={{right: "-6px"}}
			/>
		</div>
	);
};

// --- 2. CUSTOM EDGE ---
const CustomEdge = ({id, sourceX, sourceY, targetX, targetY}: EdgeProps) => {
	const [edgePath] = getBezierPath({sourceX, sourceY, targetX, targetY});
	return <BaseEdge id={id} path={edgePath} style={{stroke: "#d4d4d8", strokeWidth: 1.5}} />;
};

const nodeTypes = {marketingCard: MarketingCardNode};
const edgeTypes = {custom: CustomEdge};

// --- 3. NODE LAYOUT ---
const initialNodes: HeroNode[] = [
	// --- COLUMN 1 (Left) ---
	{
		id: "1",
		type: "marketingCard",
		position: {x: 50, y: 150},
		data: {
			type: "3D",
			label: "Rodin 2.0",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd65ba87c69df161752e5_3d_card.avif",
			width: "w-[220px]",
			height: "aspect-square",
		},
	},
	{
		id: "2",
		type: "marketingCard",
		position: {x: 50, y: 650},
		data: {
			type: "Color Reference",
			label: "",
			gradientClass: "bg-gradient-to-r from-blue-900 via-purple-800 to-orange-300",
			width: "w-[260px]",
			height: "h-[120px]",
		},
	},

	// --- COLUMN 2 (Main Center Image) ---
	{
		id: "3",
		type: "marketingCard",
		position: {x: 450, y: 300},
		data: {
			type: "Image",
			label: "Stable Diffusion",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd7cbc22419b32bb9d8d8_hcard%20-%20STABLE%20DIFFUSION.avif",
			width: "w-[340px]",
			height: "aspect-[3/4]",
		},
	},

	// --- COLUMN 3 (Input & Flux) ---
	{
		id: "4",
		type: "marketingCard",
		position: {x: 900, y: 400},
		data: {
			type: "Text",
			label: "",
			text: "a Great-Tailed Grackle bird is flying from the background and seating on the model's shoulder slowly and barely moves...",
			width: "w-[240px]",
			height: "h-auto",
		},
	},
	{
		id: "5",
		type: "marketingCard",
		position: {x: 900, y: 650},
		data: {
			type: "Image",
			label: "Flux Pro 1.1",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6837510acbe777269734b387_bird_desktop.avif",
			width: "w-[240px]",
			height: "aspect-[3/4]",
		},
	},

	// --- COLUMN 4 (Final Output) ---
	{
		id: "6",
		type: "marketingCard",
		position: {x: 1300, y: 250},
		data: {
			type: "Video",
			label: "Minimax Video",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif",
			width: "w-[360px]",
			height: "aspect-[3/4]",
		},
	},
];

const initialEdges = [
	{id: "e1-3", source: "1", target: "3", type: "custom"},
	{id: "e2-3", source: "2", target: "3", type: "custom"},
	{id: "e3-6", source: "3", target: "6", type: "custom"},
	{id: "e4-5", source: "4", target: "5", type: "custom"},
	{id: "e5-6", source: "5", target: "6", type: "custom"},
];

export default function HeroWorkflow() {
	const [nodes, , onNodesChange] = useNodesState(initialNodes);
	const [edges, , onEdgesChange] = useEdgesState(initialEdges);

	return (
		<div className="w-full h-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				proOptions={{hideAttribution: true}}
				panOnScroll={false}
				zoomOnScroll={false}
				zoomOnPinch={false}
				panOnDrag={false}
				preventScrolling={false}
				nodesDraggable={true}
				fitView
				fitViewOptions={{padding: 0.2}}
				minZoom={0.5}
				maxZoom={1}>
				<Background color="#000" gap={40} size={1} className="opacity-[0.02]" />
			</ReactFlow>
		</div>
	);
}
