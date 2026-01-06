"use client";

import React, {useState} from "react";
import {Save, Loader2, Share2} from "lucide-react";
import {useWorkflowStore} from "@/store/workflowStore";
import {saveWorkflowAction} from "@/app/actions/workflowActions";

export default function Header() {
	// 1. Grab the current state from the store
	const {nodes, edges, workflowId, setWorkflowId} = useWorkflowStore();
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (nodes.length === 0) {
			alert("Canvas is empty!");
			return;
		}

		setIsSaving(true);

		try {
			// 2. Call the Server Action
			// This runs securely on your Next.js server (NeonDB)
			const result = await saveWorkflowAction({
				id: workflowId,
				name: "My Project " + new Date().toLocaleTimeString(),
				nodes,
				edges,
			});

			if (result.success) {
                setWorkflowId(result.id);
				alert(`Workflow saved successfully! (ID: ${result.id})`);
			} else {
				alert(`❌ Failed to save: ${result.error}`);
			}
		} catch (error) {
			console.error(error);
			alert("Something went wrong while saving.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#111]">
			<div className="flex items-center gap-2">
				<div className="w-6 h-6 rounded bg-gradient-to-tr from-pink-500 to-purple-500"></div>
				<h1 className="text-sm font-bold text-white tracking-wider">WEAVY CLONE</h1>
			</div>

			<div className="flex gap-2">
				<button
					onClick={handleSave}
					disabled={isSaving}
					className="flex items-center gap-2 px-4 py-2 bg-[#dfff4f] text-black text-xs font-bold rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
					{isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
					{isSaving ? "SAVING..." : "SAVE WORKFLOW"}
				</button>
			</div>
		</header>
	);
}
