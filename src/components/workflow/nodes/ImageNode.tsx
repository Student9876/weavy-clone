"use client";

import React, {useCallback, useRef} from "react";
import {Handle, Position, NodeProps} from "@xyflow/react";
import {ImageIcon, Upload, X, Loader2, AlertCircle} from "lucide-react";
import {cn} from "@/lib/utils";
import {ImageNodeType} from "@/lib/types";
import {useWorkflowStore} from "@/store/workflowStore";

export default function ImageNode({id, data, isConnectable, selected}: NodeProps<ImageNodeType>) {
	const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Helper: Convert File to Base64
	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const onFileChange = useCallback(
		async (evt: React.ChangeEvent<HTMLInputElement>) => {
			const file = evt.target.files?.[0];
			if (!file) return;

			try {
				updateNodeData(id, {status: "loading"});

				// 1. Convert to Base64
				const base64String = await fileToBase64(file);

				// 2. Update Store with the Base64 string
				updateNodeData(id, {
					file: {
						name: file.name,
						type: file.type,
						url: base64String, // Now holds the real data
					},
					status: "success",
					errorMessage: undefined,
				});
			} catch (error) {
				console.error("Image processing failed", error);
				updateNodeData(id, {status: "error", errorMessage: "Failed to process image"});
			}
		},
		[id, updateNodeData]
	);

	// Handle Remove Image
	const clearImage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			updateNodeData(id, {file: undefined, status: "idle"});
			if (fileInputRef.current) fileInputRef.current.value = "";
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
			{/* Header */}
			<div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#111] rounded-t-xl justify-between">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
						<ImageIcon size={14} />
					</div>
					<span className="text-xs font-bold text-white uppercase tracking-wider">{data.label || "Image"}</span>
				</div>

				{data.status === "loading" && <Loader2 size={14} className="animate-spin text-white/50" />}
				{data.status === "error" && <AlertCircle size={14} className="text-red-500" />}
			</div>

			{/* Body: Dropzone / Preview */}
			<div className="p-3">
				<div
					onClick={() => !data.file && fileInputRef.current?.click()}
					className={cn(
						"relative w-full aspect-video rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center transition-colors overflow-hidden bg-[#0a0a0a]",
						!data.file && "hover:border-[#dfff4f]/50 hover:bg-white/5 cursor-pointer"
					)}>
					{data.file ? (
						// Image Preview
						<>
							<img src={data.file.url} alt="Preview" className="w-full h-full object-cover" />
							<button
								onClick={clearImage}
								className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors">
								<X size={12} />
							</button>
						</>
					) : (
						// Empty State
						<div className="text-center p-4">
							<Upload size={24} className="mx-auto text-white/20 mb-2" />
							<p className="text-[10px] text-white/40 uppercase font-bold">Click to Upload</p>
							<p className="text-[9px] text-white/20 mt-1">JPG, PNG, WEBP</p>
						</div>
					)}

					{/* Hidden Input */}
					<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
				</div>

				{/* Error Message */}
				{data.status === "error" && data.errorMessage && <div className="mt-2 text-[10px] text-red-400 font-medium">Error: {data.errorMessage}</div>}
			</div>

			{/* Output Handle (Right Only) - Images feed INTO the LLM */}
			<Handle type="source" position={Position.Right} isConnectable={isConnectable} className="!w-3 !h-3 !bg-[#dfff4f] !border-2 !border-[#1a1a1a]" />
		</div>
	);
}
