"use client";

import {useRef, useState} from "react";
import {motion, useScroll, useMotionValueEvent, useTransform} from "framer-motion";
import Image from "next/image";
import HeroSection from "@/components/marketing/HeroSection";
import ToolSection from "@/components/marketing/ToolSection";
import EditorSection from "@/components/marketing/EditorSection";
import Footer from "@/components/marketing/Footer";

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
		<div className=" font-sans">
			<HeroSection />
			<StickyModelSection />
			<ToolSection />

			<EditorSection />
			<Footer />
		</div>
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
