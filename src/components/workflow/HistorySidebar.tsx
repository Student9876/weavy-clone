"use client";

import React, {useEffect, useState} from "react";
import {X, CheckCircle2, XCircle, Clock, ChevronRight, ChevronDown, Play} from "lucide-react";
import {getWorkflowHistoryAction} from "@/app/actions/historyActions";
import {useWorkflowStore} from "@/store/workflowStore";
import {cn} from "@/lib/utils";

interface HistorySidebarProps {
	workflowId: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function HistorySidebar({workflowId, isOpen, onClose}: HistorySidebarProps) {
	const [runs, setRuns] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

	// Poll for updates every 5 seconds so we see "Running" -> "Success" automatically
	useEffect(() => {
		if (!isOpen || !workflowId) return;

		const fetchHistory = async () => {
			const res = await getWorkflowHistoryAction(workflowId);
			if (res.success) {
				setRuns(res.runs || []);
			}
		};

		fetchHistory(); // Initial fetch
		const interval = setInterval(fetchHistory, 5000); // Polling

		return () => clearInterval(interval);
	}, [workflowId, isOpen]);

	if (!isOpen) return null;

	return (
		<div className="absolute right-0 top-0 h-full w-80 bg-[#111] border-l border-white/10 shadow-2xl z-20 flex flex-col">
			{/* Header */}
			<div className="p-4 border-b border-white/10 flex items-center justify-between">
				<h2 className="text-sm font-semibold text-white flex items-center gap-2">
					<Clock size={16} /> Run History
				</h2>
				<button onClick={onClose} className="text-white/50 hover:text-white">
					<X size={18} />
				</button>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{loading && <div className="text-white/30 text-xs text-center">Loading...</div>}

				{runs.length === 0 && !loading && <div className="text-white/30 text-xs text-center py-10">No runs yet. Click "Run" to start one!</div>}

				{runs.map((run) => (
					<div key={run.id} className="border border-white/10 rounded-lg bg-[#1a1a1a] overflow-hidden">
						{/* Run Summary */}
						<div
							className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
							onClick={() => setExpandedRunId(expandedRunId === run.id ? null : run.id)}>
							<div className="flex items-center gap-3">
								<StatusIcon status={run.status} />
								<div>
									<div className="text-xs font-medium text-white">Run #{run.id.slice(0, 4)}</div>
									<div className="text-[10px] text-white/50">{new Date(run.startedAt).toLocaleString()}</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] text-white/30">{run.duration}</span>
								{expandedRunId === run.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
							</div>
						</div>

						{/* Expanded Details (The Node List) */}
						{expandedRunId === run.id && (
							<div className="bg-black/20 border-t border-white/5 p-3 space-y-2">
								{run.nodes.map((node: any) => (
									<div key={node.id} className="pl-2 border-l-2 border-white/10 relative">
										<div className="flex items-center gap-2 mb-1">
											<StatusIcon status={node.status} size={12} />
											<span className="text-xs text-white/80 font-mono">{node.type}</span>
											<span className="text-[10px] text-white/30 ml-auto">{node.duration || "..."}</span>
										</div>

										{/* Show Output Preview if Success */}
										{node.status === "SUCCESS" && node.output?.text && (
											<div className="bg-white/5 p-2 rounded text-[10px] text-white/60 font-mono truncate">
												"{(node.output.text as string).substring(0, 50)}..."
											</div>
										)}

										{/* Show Error if Failed */}
										{node.status === "FAILED" && (
											<div className="text-red-400 text-[10px] bg-red-500/10 p-2 rounded">{node.error || "Unknown Error"}</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function StatusIcon({status, size = 16}: {status: string; size?: number}) {
	if (status === "SUCCESS" || status === "COMPLETED") return <CheckCircle2 size={size} className="text-green-500" />;
	if (status === "FAILED") return <XCircle size={size} className="text-red-500" />;
	if (status === "RUNNING") return <LoaderIcon size={size} />;
	return <div className={`w-${size / 4} h-${size / 4} rounded-full bg-white/20`} />;
}

function LoaderIcon({size}: {size: number}) {
	return (
		<svg className="animate-spin text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={size} height={size}>
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	);
}
