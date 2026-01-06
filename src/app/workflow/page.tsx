"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/workflow/Sidebar";
import Header from "@/components/workflow/Header";

// 1. DYNAMIC IMPORT: Disables SSR for the Canvas
// This replaces the need for useState/useEffect isMounted checks
const FlowEditor = dynamic(() => import("@/components/workflow/FlowEditor"), {
	ssr: false,
	loading: () => <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-white/20">Loading Workflow Environment...</div>,
});

export default function EditorPage() {
	return (
		<div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
			{/* 1. Header at the top */}
			<Header />

			<div className="flex flex-1 h-full overflow-hidden">
				{/* 2. Sidebar on the left */}
				<Sidebar />

				{/* 3. Editor Canvas */}
				<main className="flex-1 relative h-full">
					<FlowEditor />
				</main>
			</div>
		</div>
	);
}
