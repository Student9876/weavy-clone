"use client";

import React, {useCallback} from "react";
import {Handle, Position, NodeProps} from "@xyflow/react";
import {Type} from "lucide-react";
import {cn} from "@/lib/utils";
import {TextNodeType} from "@/lib/types";
import {useWorkflowStore} from "@/store/workflowStore";

export default function TextNode({id, data, isConnectable, selected}: NodeProps<TextNodeType>) {
	// 1. Select the update action from the store
	const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

	const onChange = useCallback(
		(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = evt.target.value;
			// 2. Dispatch the update
			updateNodeData(id, {text: newValue});
		},
		[id, updateNodeData]
	);

	return (
		<div
			className={cn(
				"rounded-xl border bg-[#1a1a1a] min-w-[250px] shadow-xl transition-all duration-200",
				selected ? "border-[#dfff4f] ring-1 ring-[#dfff4f]/50" : "border-white/10 hover:border-white/30",
				data.status === "error" && "border-red-500 ring-1 ring-red-500/50"
			)}>
			{/* ... Header Section (No changes needed) ... */}
			<div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#111] rounded-t-xl justify-between">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
						<Type size={14} />
					</div>
					<span className="text-xs font-bold text-white uppercase tracking-wider">{data.label || "Text Input"}</span>
				</div>
			</div>

			<div className="p-3 relative">
				<label className="text-[10px] text-white/50 mb-1.5 block uppercase font-semibold">Value</label>
				{/* 3. Bind value to data.text */}
				<textarea
					className="custom-scrollbar w-full bg-[#0a0a0a] text-xs text-white rounded-lg border border-white/10 p-2 focus:outline-none focus:border-[#dfff4f]/50 resize-y min-h-[80px] font-mono nodrag placeholder:text-white/20"
					placeholder="Enter text..."
					value={data.text}
					onChange={onChange}
					disabled={data.isLocked || data.status === "loading"}
				/>
			</div>

			{/* ... Handles (No changes needed) ... */}
			<Handle type="target" position={Position.Left} isConnectable={isConnectable} className="!w-3 !h-3 !bg-[#1a1a1a] !border-2 !border-blue-400" />
			<Handle type="source" position={Position.Right} isConnectable={isConnectable} className="!w-3 !h-3 !bg-[#dfff4f] !border-2 !border-[#1a1a1a]" />
		</div>
	);
}
