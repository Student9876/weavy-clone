"use client";

import {useRef, useState} from "react";
import {motion, useScroll, useMotionValueEvent, useTransform} from "framer-motion";
import Image from "next/image";
import HeroWorkflow from "@/components/marketing/HeroWorkflow";
import ToolSection from "@/components/ToolSection";

// --- DATA ---
const aiModels = [
	{name: "GPT img 1", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif"},
	{name: "Wan", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/wan.mp4"},
	{name: "SD 3.5", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d618a9071dd147d5f_SD%203.5.avif"},
	{name: "Runway Gen-4", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/runway.mp4"},
	{name: "Imagen 3", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d65bf65cc5194ac05_Imagen%203.avif"},
	{name: "Veo 3", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/veo2.mp4"},
	{name: "GPT img 1", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif"},
	{name: "Wan", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/wan.mp4"},
	{name: "SD 3.5", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d618a9071dd147d5f_SD%203.5.avif"},
	{name: "Runway Gen-4", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/runway.mp4"},
	{name: "Imagen 3", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d65bf65cc5194ac05_Imagen%203.avif"},
	{name: "Veo 3", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/veo2.mp4"},
];

export default function LandingPage() {
	return (
		<div className="flex flex-col font-sans">
			<HeroSection />
			<StickyModelSection />
			<ToolSection />

			{/* Footer Placeholder */}
			<div className="py-8 bg-black text-white/40 text-center text-sm border-t border-white/10">© 2025 Weavy Clone. For educational purposes.</div>
		</div>
	);
}

// --- 1. HERO SECTION ---
function HeroSection() {
	return (
		<section className="relative min-h-[120vh] flex flex-col pt-32 px-6 overflow-hidden bg-[#FBFBFB]">
			{/* Background Grid */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none opacity-60" />

			{/* Typography */}
			<div className="w-full z-10 mx-10 grid grid-cols-12 gap-8 relative mb-30">
				<div className="col-span-12 md:col-span-3">
					<h1 className="text-[12vw] md:text-[5vw] leading-[0.8] font-normal tracking-tight text-black">Weavy</h1>
				</div>
				<div className="col-span-12 md:col-span-9 flex flex-col pt-2 md:pt-4">
					<h2 className="text-[9vw] md:text-[5vw] leading-[0.9] font-normal tracking-tight text-black mb-8">Artistic Intelligence</h2>
					<p className="text-lg md:text-xl leading-relaxed text-black/60 max-w-xl font-medium">
						Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
					</p>
				</div>
			</div>

			{/* --- INTERACTIVE WORKFLOW CONTAINER --- */}
			<div className="relative w-full h-[80vh] mx-auto max-w-450 rounded-t-[40px] overflow-hidden border-t border-x border-black/5 shadow-[0_-20px_60px_rgba(0,0,0,0.03)]">
				{/* The Gradient Background */}
				<div className="absolute inset-0 bg-linear-to-b from-white via-[#faf9f6] to-[#f0efe9] z-0" />

				{/* The React Flow Instance */}
				<div className="absolute inset-0 z-10">
					<HeroWorkflow />
				</div>

				{/* Bottom Fade Overlay (to blend with next section if needed) */}
				<div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#f0efe9] to-transparent z-20 pointer-events-none" />
			</div>
		</section>
	);
}

// --- 2. STICKY MODELS SECTION ---
function StickyModelSection() {
	const targetRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const {scrollYProgress} = useScroll({
		target: targetRef,
		offset: ["start start", "end end"],
	});

	// 1. Calculate Active Index
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const index = Math.floor(latest * aiModels.length);
		setActiveIndex(Math.min(Math.max(index, 0), aiModels.length - 1));
	});

	// 2. Scroll Animation
	// Moves the whole list UP. Adjusting the end value (-70%) ensures the last item hits the center.
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

	return (
		<section ref={targetRef} className="h-[400vh] relative bg-[#09090b] text-white">
			<div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
				{/* Dynamic Background Media */}
				<div className="absolute inset-0 z-0">
					{aiModels.map((model, idx) => (
						<motion.div
							key={idx}
							initial={{opacity: 0}}
							animate={{opacity: activeIndex === idx ? 1 : 0}}
							transition={{duration: 0.5, ease: "linear"}}
							className="absolute inset-0 w-full h-full">
							{model.type === "video" ? (
								<video src={model.src} autoPlay loop muted className="w-full h-full object-cover scale-105" />
							) : (
								<Image src={model.src} alt={model.name} fill className="object-cover scale-105" />
							)}
							{/* Subtle darkening for text readability */}
							<div className="absolute inset-0 bg-black/20" />
						</motion.div>
					))}
				</div>

				{/* Content Grid */}
				<div className="relative z-20 max-w-400 w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
					{/* Left: Headline */}
					<div className="md:col-span-7 flex flex-col justify-center">
						<h2 className="text-[7vw] md:text-[6vw] font-medium leading-[0.95] tracking-tight mb-8 drop-shadow-lg">
							Use all <br />
							<span className="text-white/50">AI models,</span> <br />
							together <br />
							at last
						</h2>
						<p className="text-xl md:text-2xl text-white/80 max-w-lg leading-relaxed font-medium drop-shadow-md">
							AI models and professional editing tools in one node-based platform.
						</p>
					</div>

					{/* Right: Scrolling List Window */}
					<div className="md:col-span-5 h-full overflow-hidden flex items-start relative pl-10">
						{/* The Moving List Container */}
						<motion.div style={{y}} className="flex flex-col gap-4 w-full pt-[20vh]">
							{aiModels.map((model, idx) => {
								const isActive = activeIndex === idx;
								return (
									<div
										key={idx}
										className={`text-[4vw] md:text-[3.5vw] font-medium tracking-tight leading-[1.1] cursor-pointer transition-colors ${
											isActive ? "text-[#dfff4f]" : "text-white"
										}`}>
										{model.name}
									</div>
								);
							})}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
