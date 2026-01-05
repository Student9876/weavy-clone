"use client";

import React, {useCallback} from "react";
import {Handle, Position, NodeProps, useReactFlow} from "@xyflow/react";
import {Bot, Play, Loader2, Settings2, AlertCircle, Image as ImageIcon, MessageSquare, FileText} from "lucide-react";
import {cn} from "@/lib/utils";
import type {LLMNodeData, LLMNodeType} from "@/lib/types";
import {useWorkflowStore} from "@/store/workflowStore";

export default function LLMNode({id, data, isConnectable, selected}: NodeProps<LLMNodeType>) {
	const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

	// Handle Model Selection
	const onModelChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			updateNodeData(id, {model: e.target.value as LLMNodeData["model"]});
		},
		[id, updateNodeData]
	);

	// Mock Run Function (We will connect the API later)
	const handleRun = useCallback(() => {
		updateNodeData(id, {status: "loading", errorMessage: undefined});

		// Simulate API call delay
		setTimeout(() => {
			updateNodeData(id, {
				status: "success",
				outputs: [
					{
						id: crypto.randomUUID(),
						type: "text",
						content: "This is a simulated response from Gemini. We will connect the real API next!",
						timestamp: Date.now(),
					},
				],
			});
		}, 1500);
	}, [id, updateNodeData]);

	// Helper to get the latest output content
	const latestOutput = data.outputs && data.outputs.length > 0 ? data.outputs[data.outputs.length - 1].content : "";

	return (
		<div
			className={cn(
				"rounded-xl border bg-[#1a1a1a] min-w-[300px] max-w-[400px] shadow-2xl transition-all duration-200 flex flex-col",
				selected ? "border-[#dfff4f] ring-1 ring-[#dfff4f]/50" : "border-white/10 hover:border-white/30",
				data.status === "error" && "border-red-500 ring-1 ring-red-500/50"
			)}>
			{/* --- HEADER --- */}
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

				{/* Run Button */}
				<button
					onClick={handleRun}
					disabled={data.status === "loading"}
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
						data.status === "loading"
							? "bg-white/5 text-white/20 cursor-not-allowed"
							: "bg-[#dfff4f] text-black hover:bg-white hover:scale-105 active:scale-95"
					)}>
					{data.status === "loading" ? (
						<>
							<Loader2 size={12} className="animate-spin" />
							Running
						</>
					) : (
						<>
							<Play size={12} fill="currentColor" />
							Run
						</>
					)}
				</button>
			</div>

			{/* --- BODY --- */}
			<div className="p-4 space-y-4">
				{/* Model Selector */}
				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<label className="text-[10px] text-white/50 uppercase font-semibold flex items-center gap-1.5">
							<Settings2 size={10} /> Model Configuration
						</label>
					</div>
					<select
						value={data.model}
						onChange={onModelChange}
						className="w-full bg-[#0a0a0a] text-xs text-white rounded-lg border border-white/10 p-2 focus:outline-none focus:border-[#dfff4f]/50 cursor-pointer">
						<option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
						<option value="gemini-pro">Gemini Pro (Balanced)</option>
						<option value="gemini-pro-vision">Gemini Pro Vision (Images)</option>
					</select>
				</div>

				{/* Output Display */}
				{latestOutput && (
					<div className="space-y-1.5 animate-in fade-in duration-300">
						<label className="text-[10px] text-[#dfff4f] uppercase font-semibold flex items-center gap-1.5">Generated Output</label>
						<div className="bg-[#0a0a0a] rounded-lg border border-white/10 p-3 text-xs text-white/90 leading-relaxed font-mono max-h-[200px] overflow-y-auto">
							{latestOutput}
						</div>
					</div>
				)}

				{/* Error Message */}
				{data.status === "error" && data.errorMessage && (
					<div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-medium">
						<AlertCircle size={12} />
						{data.errorMessage}
					</div>
				)}
			</div>

			{/* --- INPUT HANDLES (Left Side) --- */}

			{/* 1. System Prompt */}
			<div className="absolute -left-3 top-[80px] flex items-center group">
				<Handle
					type="target"
					position={Position.Left}
					id="system_prompt"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-2 !border-purple-400 group-hover:!bg-purple-400 transition-colors"
				/>
				<span className="absolute left-4 text-[9px] text-white/30 uppercase font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded">
					System Prompt
				</span>
			</div>

			{/* 2. User Message (Main Input) */}
			<div className="absolute -left-3 top-[120px] flex items-center group">
				<Handle
					type="target"
					position={Position.Left}
					id="user_message"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-2 !border-blue-400 group-hover:!bg-blue-400 transition-colors"
				/>
				<span className="absolute left-4 text-[9px] text-white/30 uppercase font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded">
					User Message
				</span>
			</div>

			{/* 3. Images */}
			<div className="absolute -left-3 top-[160px] flex items-center group">
				<Handle
					type="target"
					position={Position.Left}
					id="images"
					isConnectable={isConnectable}
					className="!w-3 !h-3 !bg-[#1a1a1a] !border-2 !border-orange-400 group-hover:!bg-orange-400 transition-colors"
				/>
				<span className="absolute left-4 text-[9px] text-white/30 uppercase font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded">
					Images
				</span>
			</div>

			{/* --- OUTPUT HANDLE (Right Side) --- */}
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
