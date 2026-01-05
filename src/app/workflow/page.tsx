"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/workflow/Sidebar";

// 1. DYNAMIC IMPORT: Disables SSR for the Canvas
// This replaces the need for useState/useEffect isMounted checks
const FlowEditor = dynamic(() => import("@/components/workflow/FlowEditor"), {
	ssr: false,
	loading: () => <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-white/20">Loading Workflow Environment...</div>,
});

export default function EditorPage() {
	return (
		<div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
			<Sidebar />
			<FlowEditor />
		</div>
	);
}
