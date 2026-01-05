"use client";

import React, {useCallback, useState} from "react";
import {Handle, Position, NodeProps, useReactFlow} from "@xyflow/react";
import {Bot, Plus, Loader2, MoreHorizontal, Settings2, Copy, Check} from "lucide-react";
import {cn} from "@/lib/utils";
import type {LLMNodeData, LLMNodeType, TextNodeData, ImageNodeData} from "@/lib/types";
import {useWorkflowStore} from "@/store/workflowStore";
import {generateContent} from "@/app/actions/gemini";

export default function LLMNode({id, data, isConnectable, selected}: NodeProps<LLMNodeType>) {
	const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
	const {getNodes, getEdges} = useReactFlow();
	const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const onModelChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			updateNodeData(id, {model: e.target.value as LLMNodeData["model"]});
		},
		[id, updateNodeData]
	);

	const handleCopy = useCallback(async () => {
		if (data.outputs && data.outputs.length > 0) {
			const textToCopy = data.outputs[data.outputs.length - 1].content;
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}, [data.outputs]);

	const handleRun = useCallback(async () => {
		updateNodeData(id, {status: "loading", errorMessage: undefined});
		console.log("--- RUN STARTED ---");

		try {
			const allNodes = getNodes();
			const allEdges = getEdges();
			const targetEdges = allEdges.filter((edge) => edge.target === id);

			console.log(`Found ${targetEdges.length} connections to this node`);

			let systemPrompt = "";
			let userPrompt = "";
			const imageUrls: string[] = [];

			// Collect inputs based on handle IDs
			targetEdges.forEach((edge) => {
				const sourceNode = allNodes.find((n) => n.id === edge.source);
				if (!sourceNode) return;

				console.log(`Connected node type: ${sourceNode.type}, target handle: ${edge.targetHandle}`);

				// Handle Text Nodes
				if (sourceNode.type === "textNode") {
					const text = (sourceNode.data as TextNodeData).text;
					if (edge.targetHandle === "system-prompt") {
						systemPrompt = text || "";
					} else if (edge.targetHandle === "prompt") {
						userPrompt = text || "";
					}
				}

				// Handle Image Nodes (connected to image handle)
				if (sourceNode.type === "imageNode" && edge.targetHandle === "image") {
					const file = (sourceNode.data as ImageNodeData).file;
					if (file?.url) {
						console.log("Found image:", file.name);
						imageUrls.push(file.url);
					}
				}
			});

			console.log("Final Inputs:", {systemPrompt, userPrompt, imageCount: imageUrls.length});

			// Validation
			if (!userPrompt.trim() && imageUrls.length === 0) {
				throw new Error("Input required: Connect a prompt or image");
			}

			// Combine prompts for API
			let finalPrompt = userPrompt.trim();
			if (systemPrompt.trim()) {
				finalPrompt = `${systemPrompt.trim()}\n\n${finalPrompt}`;
			}

			// Call Gemini API
			console.log("Using model:", data.model);
			const result = await generateContent(data.model, finalPrompt, imageUrls);

			if (!result.success) {
				throw new Error(result.error || "Failed to generate content");
			}

			updateNodeData(id, {
				status: "success",
				outputs: [
					{
						id: crypto.randomUUID(),
						type: "text",
						content: result.text || "No response.",
						timestamp: Date.now(),
					},
				],
			});
		} catch (error: unknown) {
			console.error("Run Failed:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			updateNodeData(id, {status: "error", errorMessage});
		}
	}, [id, updateNodeData, getNodes, getEdges, data.model]);

	return (
		<div
			className={cn(
				"rounded-xl border bg-[#1a1a1a] min-w-[320px] max-w-[400px] shadow-2xl transition-all duration-200 flex flex-col max-h-[600px]",
				selected ? "border-[#dfff4f] ring-1 ring-[#dfff4f]/50" : "border-white/10 hover:border-white/30",
				data.status === "error" && "border-red-500 ring-1 ring-red-500/50"
			)}>
			{/* Header */}
			<div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 bg-[#111] rounded-t-xl">
				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-white">{data.model || "gemini-2.5-flash"}</span>
				</div>

				<button className="p-1 hover:bg-white/5 rounded transition-colors">
					<MoreHorizontal size={14} className="text-white/50" />
				</button>
			</div>

			{/* Body */}
			<div className="p-6 space-y-3">
				{/* Model Selection */}
				<div className="space-y-1.5">
					<label className="text-[10px] text-white/50 uppercase font-semibold flex items-center gap-1.5">
						<Settings2 size={10} /> Model Configuration
					</label>
					<select
						value={data.model}
						onChange={onModelChange}
						className="w-full bg-[#0a0a0a] text-xs text-white rounded-lg border border-white/10 p-2 focus:outline-none focus:border-[#dfff4f]/50 cursor-pointer">
						<option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Fast)</option>
						<option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Powerful)</option>
						<option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
					</select>
				</div>

				{/* Output Display Area */}
				<div className="bg-[#2a2a2a] rounded-lg border border-white/10 flex flex-col">
					{/* Header with Copy Button */}
					{data.status === "success" && data.outputs && data.outputs.length > 0 && (
						<div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
							<span className="text-[10px] text-white/40 uppercase font-semibold">Output</span>
							<button
								onClick={handleCopy}
								className="flex items-center gap-1 px-2 py-1 text-[10px] text-white/60 hover:text-white/90 hover:bg-white/5 rounded transition-colors">
								{copied ? (
									<>
										<Check size={11} />
										Copied!
									</>
								) : (
									<>
										<Copy size={11} />
										Copy
									</>
								)}
							</button>
						</div>
					)}

					{/* Content Area with Fixed Height */}
					<div className="p-3 overflow-y-auto custom-scrollbar" style={{height: "180px", maxHeight: "180px"}}>
						{data.status === "loading" ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 size={20} className="animate-spin text-white/30" />
							</div>
						) : data.status === "success" && data.outputs && data.outputs.length > 0 ? (
							<div className="w-full text-xs text-white/80 font-mono leading-relaxed whitespace-pre-wrap break-words">
								{data.outputs[data.outputs.length - 1].content}
							</div>
						) : (
							<div className="flex items-center justify-center h-full">
								<span className="text-xs text-white/30">The generated text will appear here</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer: Add image + Run button */}
			<div className="px-6 mb-6 pb-3 flex items-center justify-between gap-2">
				<button className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 transition-colors font-medium">
					<Plus size={12} />
					Add another image input
				</button>

				<button
					onClick={handleRun}
					disabled={data.status === "loading"}
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all",
						data.status === "loading" ? "bg-white/5 text-white/30 cursor-not-allowed" : "bg-white/90 text-black hover:bg-white active:scale-95"
					)}>
					{data.status === "loading" ? (
						<>
							<Loader2 size={12} className="animate-spin" />
						</>
					) : (
						<>
							<Bot size={12} />
							Run Model
						</>
					)}
				</button>
			</div>

			{/* Three Input Handles on Left Side with Hover Labels */}
			<div className="absolute left-0" style={{top: "35%"}}>
				<Handle
					type="target"
					position={Position.Left}
					id="system-prompt"
					isConnectable={isConnectable}
					onMouseEnter={() => setHoveredHandle("system-prompt")}
					onMouseLeave={() => setHoveredHandle(null)}
					className="!w-2.5 !h-2.5 !bg-[#1a1a1a] !border-2 !border-emerald-400"
				/>
				{hoveredHandle === "system-prompt" && (
					<div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/90 text-emerald-400 text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
						System Prompt
					</div>
				)}
			</div>

			<div className="absolute left-0" style={{top: "50%"}}>
				<Handle
					type="target"
					position={Position.Left}
					id="prompt"
					isConnectable={isConnectable}
					onMouseEnter={() => setHoveredHandle("prompt")}
					onMouseLeave={() => setHoveredHandle(null)}
					className="!w-2.5 !h-2.5 !bg-[#1a1a1a] !border-2 !border-pink-400"
				/>
				{hoveredHandle === "prompt" && (
					<div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/90 text-pink-400 text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
						Prompt
					</div>
				)}
			</div>

			<div className="absolute left-0" style={{top: "65%"}}>
				<Handle
					type="target"
					position={Position.Left}
					id="image"
					isConnectable={isConnectable}
					onMouseEnter={() => setHoveredHandle("image")}
					onMouseLeave={() => setHoveredHandle(null)}
					className="!w-2.5 !h-2.5 !bg-[#1a1a1a] !border-2 !border-purple-400"
				/>
				{hoveredHandle === "image" && (
					<div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/90 text-purple-400 text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
						Image
					</div>
				)}
			</div>
		</div>
	);
}
