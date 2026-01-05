"use client";

import React, {useCallback} from "react";
import {Handle, Position, NodeProps, useReactFlow} from "@xyflow/react";
import {Bot, Play, Loader2, Settings2, AlertCircle} from "lucide-react";
import {cn} from "@/lib/utils";
import type {LLMNodeData, LLMNodeType, TextNodeData, ImageNodeData} from "@/lib/types";
import {useWorkflowStore} from "@/store/workflowStore";
import {generateContent} from "@/app/actions/gemini";

export default function LLMNode({id, data, isConnectable, selected}: NodeProps<LLMNodeType>) {
	const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
	const {getNodes, getEdges} = useReactFlow();

	const onModelChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			updateNodeData(id, {model: e.target.value as LLMNodeData["model"]});
		},
		[id, updateNodeData]
	);

	const handleRun = useCallback(async () => {
		updateNodeData(id, {status: "loading", errorMessage: undefined});
		console.log("--- RUN STARTED ---");

		try {
			const allNodes = getNodes();
			const allEdges = getEdges();
			const targetEdges = allEdges.filter((edge) => edge.target === id);

			console.log(`Found ${targetEdges.length} connections to this node`);

			let promptText = "";
			const imageUrls: string[] = [];

			// Collect all inputs from connected nodes
			targetEdges.forEach((edge) => {
				const sourceNode = allNodes.find((n) => n.id === edge.source);
				if (!sourceNode) return;

				console.log(`Connected node type: ${sourceNode.type}`);

				// Handle Text Nodes
				if (sourceNode.type === "textNode") {
					const text = (sourceNode.data as TextNodeData).text;
					if (text) promptText += text + "\n";
				}

				// Handle Image Nodes
				if (sourceNode.type === "imageNode") {
					const file = (sourceNode.data as ImageNodeData).file;
					if (file?.url) {
						console.log("Found image:", file.name);
						imageUrls.push(file.url);
					}
				}
			});

			console.log("Final Inputs:", {promptText: promptText.trim(), imageCount: imageUrls.length});

			// Validation
			if (!promptText.trim() && imageUrls.length === 0) {
				throw new Error("Input required: Connect a Text Node or Image Node");
			}

			// Call Gemini API
			console.log("Using model:", data.model);
			const result = await generateContent(data.model, promptText.trim(), imageUrls);

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

	const latestOutput = data.outputs && data.outputs.length > 0 ? data.outputs[data.outputs.length - 1].content : "";

	return (
		<div
			className={cn(
				"rounded-xl border bg-[#1a1a1a] min-w-[300px] max-w-[400px] shadow-2xl transition-all duration-200 flex flex-col",
				selected ? "border-[#dfff4f] ring-1 ring-[#dfff4f]/50" : "border-white/10 hover:border-white/30",
				data.status === "error" && "border-red-500 ring-1 ring-red-500/50"
			)}>
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#111] rounded-t-xl">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded bg-[#dfff4f]/10 flex items-center justify-center text-[#dfff4f]">
						<Bot size={18} />
					</div>
					<div>
						<span className="text-xs font-bold text-white uppercase tracking-wider block">Gemini Worker</span>
						<span className="text-[10px] text-white/40 font-mono">{data.model}</span>
					</div>
				</div>

				<button
					onClick={handleRun}
					disabled={data.status === "loading"}
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
						data.status === "loading" ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-[#dfff4f] text-black hover:bg-white active:scale-95"
					)}>
					{data.status === "loading" ? (
						<>
							<Loader2 size={12} className="animate-spin" /> Running
						</>
					) : (
						<>
							<Play size={12} fill="currentColor" /> Run
						</>
					)}
				</button>
			</div>

			{/* Body */}
			<div className="p-4 space-y-4">
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

				{latestOutput && (
					<div className="space-y-1.5 animate-in fade-in duration-300">
						<label className="text-[10px] text-[#dfff4f] uppercase font-semibold flex items-center gap-1.5">Generated Output</label>
						<div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-3 text-xs text-white/90 leading-relaxed font-mono max-h-[200px] overflow-y-auto">
							{latestOutput}
						</div>
					</div>
				)}

				{data.status === "error" && data.errorMessage && (
					<div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-medium">
						<AlertCircle size={12} />
						{data.errorMessage}
					</div>
				)}
			</div>

			{/* Single Input Handle (Left) */}
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				isConnectable={isConnectable}
				className="!w-3 !h-3 !bg-[#1a1a1a] !border-2 !border-blue-400"
			/>

			{/* Output Handle (Right) */}
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				isConnectable={isConnectable}
				className="!w-3 !h-3 !bg-[#dfff4f] !border-2 !border-[#1a1a1a]"
			/>
		</div>
	);
}
