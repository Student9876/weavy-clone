"use client";

import React, {useCallback} from "react";
import {Handle, Position, NodeProps, useReactFlow} from "@xyflow/react";
import {Bot, Play, Loader2, Settings2, AlertCircle} from "lucide-react";
import {cn} from "@/lib/utils";
// Import specific node types for casting
import type {LLMNodeData, LLMNodeType, TextNodeType, ImageNodeType} from "@/lib/types";
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

		try {
			const nodes = getNodes();
			const edges = getEdges();
			const targetEdges = edges.filter((edge) => edge.target === id);

			let systemPrompt = "";
			let userMessage = "";
			const imageUrls: string[] = [];

			targetEdges.forEach((edge) => {
				const sourceNode = nodes.find((n) => n.id === edge.source);
				if (!sourceNode) return;

				// 1. Type Guard for Text Node
				if (edge.targetHandle === "system_prompt" && sourceNode.type === "textNode") {
					// Safe cast because we checked the type
					const textData = (sourceNode as TextNodeType).data;
					systemPrompt += textData.text || "";
				}

				// 2. Type Guard for User Message
				if (edge.targetHandle === "user_message" && sourceNode.type === "textNode") {
					const textData = (sourceNode as TextNodeType).data;
					userMessage += textData.text || "";
				}

				// 3. Type Guard for Image Node
				if (edge.targetHandle === "images" && sourceNode.type === "imageNode") {
					const imageData = (sourceNode as ImageNodeType).data;
					if (imageData.file?.url) {
						imageUrls.push(imageData.file.url);
					}
				}
			});

			if (!userMessage.trim() && imageUrls.length === 0) {
				throw new Error("Input required: Please connect a Text Node or Image Node.");
			}

			const finalPrompt = systemPrompt ? `System Instruction: ${systemPrompt}\n\nUser Request: ${userMessage}` : userMessage;

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
						content: result.text || "No response generated.",
						timestamp: Date.now(),
					},
				],
			});
		} catch (error: unknown) {
			// Fix: Use 'unknown' instead of 'any' in catch block
			console.error("Run Failed:", error);
			const msg = error instanceof Error ? error.message : "An unknown error occurred";
			updateNodeData(id, {status: "error", errorMessage: msg});
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
					{data.status === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
					{data.status === "loading" ? "Running" : "Run"}
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
						{/* Updated to real Gemini Model Names */}
						<option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
						<option value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful)</option>
						<option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
					</select>
				</div>

				{latestOutput && (
					<div className="space-y-1.5 animate-in fade-in duration-300">
						<label className="text-[10px] text-[#dfff4f] uppercase font-semibold flex items-center gap-1.5">Output</label>
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

			{/* Handles */}
			<div className="absolute -left-3 top-[80px] group">
				<Handle
					type="target"
					position={Position.Left}
					id="system_prompt"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-purple-400"
				/>
			</div>
			<div className="absolute -left-3 top-[120px] group">
				<Handle
					type="target"
					position={Position.Left}
					id="user_message"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-blue-400"
				/>
			</div>
			<div className="absolute -left-3 top-[160px] group">
				<Handle
					type="target"
					position={Position.Left}
					id="images"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-orange-400"
				/>
			</div>
			<Handle type="source" position={Position.Right} id="output" isConnectable={isConnectable} className="!w-3 !h-3 !bg-[#dfff4f]" />
		</div>
	);
}
