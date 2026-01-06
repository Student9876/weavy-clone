"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Loader2, Plus, Search, Folder, Clock, Trash2, ChevronRight} from "lucide-react";
import {getAllWorkflowsAction, deleteWorkflowAction, saveWorkflowAction} from "@/app/actions/workflowActions";
import {DEMO_WORKFLOWS} from "@/lib/demoWorkflows";

// TypeScript interface for Workflow
interface Workflow {
	id: string;
	name: string;
	created_at: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchWorkflows = async () => {
			setLoading(true);
			const res = await getAllWorkflowsAction();
			if (res.success) {
				setWorkflows(res.workflows);
			}
			setLoading(false);
		};

		fetchWorkflows();
	}, []);

	const handleCreateNew = async () => {
		setCreating(true);

		try {
			// Create a new workflow in the database with empty nodes/edges
			const result = await saveWorkflowAction({
				name: "Untitled Workflow",
				nodes: [],
				edges: [],
			});

			if (result.success && result.id) {
				// Redirect to the new workflow editor
				router.push(`/workflows/${result.id}`);
			} else {
				alert(`Failed to create workflow: ${result.error}`);
				setCreating(false);
			}
		} catch (error) {
			console.error("Error creating workflow:", error);
			alert("Something went wrong while creating the workflow.");
			setCreating(false);
		}
	};

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!confirm("Are you sure you want to delete this workflow?")) return;

		const res = await deleteWorkflowAction(id);
		if (res.success) {
			setWorkflows(workflows.filter((wf) => wf.id !== id));
		} else {
			alert(`Failed to delete: ${res.error}`);
		}
	};

	// Filter workflows by search
	const filteredWorkflows = workflows.filter((wf) => wf.name.toLowerCase().includes(searchQuery.toLowerCase()));

	// Format relative time
	const getRelativeTime = (date: string) => {
		const now = new Date();
		const past = new Date(date);
		const diffMs = now.getTime() - past.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins} minutes ago`;
		if (diffHours < 24) return `${diffHours} hours ago`;
		if (diffDays < 7) return `${diffDays} days ago`;
		return past.toLocaleDateString();
	};

	return (
		<div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans">
			{/* --- SIDEBAR --- */}
			<aside className="w-56 border-r border-white/5 p-4 flex flex-col gap-4">
				{/* User / Workspace */}
				<button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
					<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
					<span className="font-semibold text-sm">DIVINE ZEON</span>
					<ChevronDown size={14} className="text-white/50 ml-auto" />
				</button>

				{/* Create New Button */}
				<button
					onClick={handleCreateNew}
					disabled={creating}
					className="w-full flex items-center justify-center gap-2 bg-[#dfff4f] text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
					{creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
					{creating ? "Creating..." : "Create New File"}
				</button>

				{/* Navigation */}
				<nav className="flex-1 flex flex-col gap-1 mt-2">
					<Link href="/workflows" className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-white font-medium text-sm">
						<div className="flex items-center gap-3">
							<Folder size={16} />
							My Files
						</div>
						<Plus size={14} className="text-white/50 hover:text-white" />
					</Link>
					<Link
						href="#"
						className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white text-sm transition-colors">
						<Users size={16} />
						Shared with me
					</Link>
					<Link
						href="#"
						className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white text-sm transition-colors">
						<AppWindow size={16} />
						Apps
					</Link>
				</nav>

				{/* Discord Link */}
				<div className="mt-auto">
					<Link
						href="#"
						className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white text-sm transition-colors">
						<MessageCircle size={16} />
						Discord
					</Link>
				</div>
			</aside>

			{/* --- MAIN CONTENT --- */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="h-14 border-b border-white/5 flex items-center justify-between px-8">
					<h1 className="text-sm font-semibold text-white/80">DIVINE ZEON&apos;s Workspace</h1>
					<button
						onClick={handleCreateNew}
						disabled={creating}
						className="flex items-center gap-2 border border-[#dfff4f] text-[#dfff4f] px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#dfff4f] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						{creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
						{creating ? "Creating..." : "Create New File"}
					</button>
				</header>

				<div className="flex-1 overflow-y-auto p-8">
					{/* --- WORKFLOW LIBRARY --- */}
					<section className="mb-10">
						<div className="flex items-center gap-6 mb-5">
							<h2 className="text-sm font-semibold text-white/90 px-3 py-1 bg-white/5 rounded-full">Workflow library</h2>
							<span className="text-sm text-white/40 hover:text-white cursor-pointer transition-colors">Tutorials</span>
						</div>

						<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
							{DEMO_WORKFLOWS.map((demo) => (
								<Link
									key={demo.id}
									href={`/workflows/${demo.id}`}
									className="group relative min-w-[200px] h-[140px] rounded-xl overflow-hidden border border-white/10 hover:border-[#dfff4f]/50 transition-all hover:-translate-y-1 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
									{/* Content */}
									<div className="relative h-full p-4 flex flex-col">
										{/* Thumbnail/Icon */}
										<div className="flex-1 flex items-center justify-center">
											<div className="text-4xl">{demo.thumbnail}</div>
										</div>

										{/* Name */}
										<div>
											<h3 className="text-sm font-semibold text-white truncate">{demo.name}</h3>
											<p className="text-xs text-white/50 truncate mt-0.5">{demo.description}</p>
										</div>
									</div>

									{/* Arrow on hover */}
									<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
										<ChevronRight size={16} className="text-white" />
									</div>
								</Link>
							))}
						</div>
					</section>

					{/* --- MY FILES --- */}
					<section>
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-base font-semibold">My files</h2>

							{/* Search Bar */}
							<div className="relative">
								<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
								<input
									type="text"
									placeholder="Search"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="bg-transparent border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors w-48"
								/>
							</div>
						</div>

						{/* Files Grid */}
						{loading ? (
							<div className="flex justify-center p-12">
								<Loader2 className="animate-spin text-white/30" size={32} />
							</div>
						) : filteredWorkflows.length === 0 ? (
							<div className="text-center p-12 border border-dashed border-white/10 rounded-xl">
								<p className="text-white/50">{searchQuery ? "No workflows found." : "No files yet. Create one to get started!"}</p>
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
								{filteredWorkflows.map((wf) => (
									<Link
										key={wf.id}
										href={`/workflows/${wf.id}`}
										className="group relative rounded-xl overflow-hidden bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-white/20 transition-all">
										{/* Thumbnail Section - Square aspect ratio */}
										<div className="relative aspect-square bg-[#1a1a1a] flex items-center justify-center">
											{/* Workflow Icon */}
											<div className="text-white/20 group-hover:text-white/30 transition-colors">
												<WorkflowIcon size={48} />
											</div>

											{/* Delete Button */}
											<button
												onClick={(e) => handleDelete(wf.id, e)}
												className="absolute top-2 right-2 p-1.5 rounded-md bg-black/50 backdrop-blur-sm hover:bg-red-500/90 text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
												title="Delete workflow">
												<Trash2 size={12} />
											</button>
										</div>

										{/* Info Section */}
										<div className="p-3">
											<h3 className="font-semibold text-sm text-white truncate mb-1">
												{wf.name}
											</h3>
											<p className="text-[10px] text-white/40 flex items-center gap-1">
												<Clock size={9} />
												Last edited {getRelativeTime(wf.created_at)}
											</p>
										</div>
									</Link>
								))}
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}

// Icons (same as before)
function ChevronDown({size, className}: {size?: number; className?: string}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

function Users({size, className}: {size?: number; className?: string}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}

function AppWindow({size, className}: {size?: number; className?: string}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="M10 4v4" />
			<path d="M2 8h20" />
			<path d="M6 4v4" />
		</svg>
	);
}

function MessageCircle({size, className}: {size?: number; className?: string}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}>
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}

function WorkflowIcon({size}: {size?: number}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || 24}
			height={size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round">
			<rect x="3" y="3" width="6" height="6" rx="1" />
			<rect x="15" y="3" width="6" height="6" rx="1" />
			<rect x="9" y="15" width="6" height="6" rx="1" />
			<path d="M6 9v3a1 1 0 0 0 1 1h4" />
			<path d="M18 9v3a1 1 0 0 1-1 1h-4" />
			<path d="M12 13v2" />
		</svg>
	);
}
