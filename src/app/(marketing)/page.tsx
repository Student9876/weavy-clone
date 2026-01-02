"use client";

import React, {useRef, useState} from "react";
import {motion, useScroll, useMotionValueEvent} from "framer-motion";
import Image from "next/image";

// --- DATA ---
const aiModels = [
	{name: "GPT img 1", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif"},
	{name: "Wan", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/wan.mp4"},
	{name: "SD 3.5", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d618a9071dd147d5f_SD%203.5.avif"},
	{name: "Runway Gen-4", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/runway.mp4"},
	{name: "Imagen 3", type: "image", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d65bf65cc5194ac05_Imagen%203.avif"},
	{name: "Veo 3", type: "video", src: "https://assets.weavy.ai/homepage/mobile-videos/veo2.mp4"},
];

const tools = [
	{name: "Crop", top: "20%", left: "15%"},
	{name: "Inpaint", top: "35%", left: "25%"},
	{name: "Upscale", top: "60%", left: "20%"},
	{name: "Outpaint", top: "25%", left: "65%"},
	{name: "Mask Extractor", top: "50%", left: "70%"},
	{name: "Relight", top: "70%", left: "60%"},
];

export default function LandingPage() {
	return (
		<div className="flex flex-col font-sans">
			<HeroSection />
			<StickyModelSection />
			<ToolsSection />

			{/* Footer Placeholder */}
			<div className="py-8 bg-black text-white/40 text-center text-sm border-t border-white/10">© 2025 Weavy Clone. For educational purposes.</div>
		</div>
	);
}

// --- 1. HERO SECTION (Pixel Perfect Typography) ---
function HeroSection() {
	return (
		<section className="relative h-screen flex flex-col justify-center px-6 overflow-hidden bg-[#FBFBFB]">
			{/* Grid Background */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60" />

			{/* Main Content Container */}
			<div className="mx-auto w-full px-6 z-10 grid grid-cols-12 gap-4 h-[60vh] items-center">
				{/* Left Column: "Weavy" */}
				<div className="col-span-12 md:col-span-4 flex items-start h-full pt-10">
					<h1 className="text-[14vw] md:text-[5vw] leading-[0.8] font-medium tracking-[-0.04em] text-black">Weavy</h1>
				</div>
				{/* Right Column: "Artistic Intelligence" + Subtext */}
				<div className="col-span-12 md:col-span-8 flex flex-col justify-start h-full pt-10 pl-0 md:pl-12">
					<h2 className="text-[9vw] md:text-[5vw] leading-[0.9] font-medium tracking-[-0.04em] text-black mb-8">Artistic Intelligence</h2>
					<p className="text-lg md:text-[1.4rem] leading-relaxed text-black/70 max-w-[600px] font-medium">
						Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
					</p>
				</div>
			</div>

			{/* Decorative Floating Cards (Using Next/Image for optimization if they were real images, sticking to divs for pure UI shapes as per reference) */}
			<div className="absolute inset-0 w-full h-full pointer-events-none">
				{/* 3D Model Card */}
				<div className="absolute bottom-[-10%] left-[5%] w-[18vw] aspect-[4/5] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/5 rotate-[-3deg] overflow-hidden">
					<div className="p-4 text-[10px] font-mono text-black/50 uppercase tracking-widest">3D - Rodin</div>
					<div className="relative w-full h-full">
						<Image
							src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd65ba87c69df161752e5_3d_card.avif"
							alt="3D"
							fill
							className="object-cover"
							sizes="20vw"
						/>
					</div>
				</div>

				{/* Stable Diffusion Card */}
				<div className="absolute bottom-[-5%] left-[30%] w-[22vw] aspect-[4/5] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/5 rotate-[2deg] z-10 overflow-hidden">
					<div className="p-4 text-[10px] font-mono text-black/50 uppercase tracking-widest">Image - Stable Diffusion</div>
					<div className="relative w-full h-full">
						<Image
							src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd7cbc22419b32bb9d8d8_hcard%20-%20STABLE%20DIFFUSION.avif"
							alt="SD"
							fill
							className="object-cover"
							sizes="25vw"
						/>
					</div>
				</div>

				{/* Flux Pro Card */}
				<div className="absolute bottom-[-15%] right-[10%] w-[20vw] aspect-[4/5] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/5 rotate-[-4deg] overflow-hidden">
					<div className="p-4 text-[10px] font-mono text-black/50 uppercase tracking-widest">Image - Flux Pro 1.1</div>
					<div className="relative w-full h-full">
						<Image
							src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6837510acbe777269734b387_bird_desktop.avif"
							alt="Flux"
							fill
							className="object-cover"
							sizes="25vw"
						/>
					</div>
				</div>
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

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const index = Math.floor(latest * aiModels.length);
		setActiveIndex(Math.min(Math.max(index, 0), aiModels.length - 1));
	});

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
							transition={{duration: 0.7, ease: "easeInOut"}}
							className="absolute inset-0 w-full h-full">
							{model.type === "video" ? (
								<video src={model.src} autoPlay loop muted className="w-full h-full object-cover opacity-40 blur-[80px] scale-110" />
							) : (
								<Image src={model.src} alt={model.name} fill className="object-cover opacity-40 blur-[80px] scale-110" />
							)}
						</motion.div>
					))}
					<div className="absolute inset-0 bg-black/30 z-10" />
				</div>

				{/* Content Grid */}
				<div className="relative z-20 max-w-[1600px] w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
					{/* Left: Headline */}
					<div className="md:col-span-7 flex flex-col justify-center">
						<h2 className="text-[7vw] md:text-[6vw] font-medium leading-[0.95] tracking-tight mb-8">
							Use all <br />
							<span className="text-white/40">AI models,</span> <br />
							together <br />
							at last
						</h2>
						<p className="text-xl md:text-2xl text-white/60 max-w-lg leading-relaxed font-medium">
							AI models and professional editing tools in one node-based platform. Turn creative vision into scalable workflows without
							compromising quality.
						</p>
					</div>

					{/* Right: Scrollable List */}
					<div className="md:col-span-5 flex flex-col justify-center gap-1 pl-10 border-l border-white/10 h-[60vh] overflow-hidden mask-linear-fade">
						{aiModels.map((model, idx) => {
							const isActive = activeIndex === idx;
							return (
								<motion.div
									key={idx}
									animate={{
										opacity: isActive ? 1 : 0.25,
										x: isActive ? 0 : 0,
										scale: isActive ? 1 : 0.95,
										filter: isActive ? "blur(0px)" : "blur(1px)",
									}}
									transition={{duration: 0.4, ease: "easeOut"}}
									className={`text-[4vw] md:text-[3.5vw] font-medium tracking-tight leading-[1.2] cursor-pointer origin-left ${
										isActive ? "text-[#dfff4f]" : "text-white"
									}`}>
									{model.name}
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

// --- 3. TOOLS SECTION ---
function ToolsSection() {
	return (
		<section className="py-40 px-6 bg-[#FBFBFB] relative z-20">
			<div className="max-w-[1600px] mx-auto text-center mb-32">
				<h2 className="text-[7vw] md:text-[6vw] font-medium tracking-[-0.03em] text-black leading-[1] mb-8">
					With all the professional <br /> tools you rely on
				</h2>
				<p className="text-black/50 text-xl md:text-2xl font-medium tracking-wide">In one seamless workflow</p>
			</div>

			<div className="max-w-[1200px] mx-auto relative h-[800px] rounded-[40px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
				{/* Grid Background */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:50px_50px]" />

				{/* Central Image */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-zinc-100 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.1)] z-10 overflow-hidden border border-black/5">
					<Image
						src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif"
						alt="Main Tool"
						fill
						className="object-cover"
						sizes="400px"
						priority
					/>
				</div>

				{/* Floating Tool Pills */}
				{tools.map((tool, i) => (
					<motion.div
						key={i}
						initial={{opacity: 0, scale: 0.9}}
						whileInView={{opacity: 1, scale: 1}}
						viewport={{once: true}}
						transition={{delay: i * 0.1}}
						className="absolute bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-white/50 flex items-center gap-3 text-[16px] font-semibold text-black/80 z-20 whitespace-nowrap cursor-default hover:scale-105 transition-transform"
						style={{top: tool.top, left: tool.left}}>
						{/* Simple Circle Icon Placeholder */}
						<div className="w-2 h-2 bg-black rounded-full opacity-20"></div>
						{tool.name}
					</motion.div>
				))}
			</div>
		</section>
	);
}
