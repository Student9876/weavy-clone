import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";


export default function ToolSection() {
	const [activeTool, setActiveTool] = useState(0);

	const tools = [
		{name: "Crop", top: "15%", left: "15%", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563af147b5d7c2496ff_Crop%402x.avif"},
		{
			name: "Inpaint",
			top: "45%",
			left: "8%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245639e16941f61edcc06_Inpaint%402x.avif",
		},
		{
			name: "Upscale",
			top: "70%",
			left: "20%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245638e6550c59d0bce8f_Upscale%402x.avif",
		},
		{
			name: "Outpaint",
			top: "25%",
			left: "25%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6822456436dd3ce4b39b6372_Outpaint%402x.avif",
		},
		{
			name: "Mask Extractor",
			top: "55%",
			left: "28%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d5cb54c747f189ae_Mask%402x.avif",
		},
		{
			name: "Relight",
			top: "55%",
			left: "82%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563b4846eaa2d70f69e_Relight%402x.avif",
		},
		{
			name: "Invert",
			top: "22%",
			left: "38%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif",
		},
		{
			name: "Image Describer",
			top: "35%",
			left: "72%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825ab42a8f361a9518d5a7f_Image%20describer%402x.avif",
		},
		{
			name: "Channels",
			top: "25%",
			left: "78%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245646909d06ed8a17f4d_Channels%402x.avif",
		},
		{
			name: "Painter",
			top: "12%",
			left: "85%",
			image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif",
		},
	];

	// Define the positions for left and right tool pills
	const leftTools = [
		{index: 0, top: "18%", right: "calc(50% + 280px)"},
		{index: 1, top: "32%", right: "calc(50% + 220px)"},
		{index: 2, top: "42%", right: "calc(50% + 280px)"},
		{index: 3, top: "54%", right: "calc(50% + 320px)"},
		{index: 4, top: "62%", right: "calc(50% + 220px)"},
		{index: 5, top: "74%", right: "calc(50% + 280px)"},
	];
	const rightTools = [
		{index: 6, top: "18%", left: "calc(50% + 280px)"},
		{index: 7, top: "34%", left: "calc(50% + 240px)"},
		{index: 8, top: "48%", left: "calc(50% + 280px)"},
		{index: 9, top: "62%", left: "calc(50% + 260px)"},
		// Remove or comment out the next line if you have only 10 tools:
		// {index: 10, top: "76%", left: "calc(50% + 220px)"},
	];

	return (
		<section className="py-20 px-6 bg-[#FBFBFB] relative overflow-hidden min-h-[60vh] flex flex-col items-center justify-center">
			{/* Background Grid */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

			{/* Gradients */}
			<div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-[#FBFBFB] via-[#FBFBFB]/90 to-transparent pointer-events-none z-10" />
			<div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-[#FBFBFB] via-[#FBFBFB]/90 to-transparent pointer-events-none z-10" />

			<div className="max-w-[1600px] mx-auto text-center mb-12 relative z-20">
				<h2 className="text-[5vw] md:text-[3.5vw] font-medium tracking-[-0.03em] text-black leading-[1] mb-4">
					With all the professional <br /> tools you rely on
				</h2>
				<p className="text-black/60 text-base md:text-lg font-medium tracking-wide">In one seamless workflow</p>
			</div>

			{/* Interactive Tool Area */}
			<div className="relative w-full max-w-[1200px] h-[600px] z-20">
				{/* Central Image Container - Smaller */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[350px] md:w-[360px] md:h-[450px] z-10 rounded-2xl overflow-hidden shadow-xl border border-black/10 bg-white">
					<Image
						src={tools[activeTool].image}
						alt={tools[activeTool].name}
						width={360}
						height={450}
						className="w-full h-full object-cover"
						priority
					/>
				</div>

				{/* Left Side Tool Pills */}
				{leftTools.map((position, i) => (
					<motion.button
						key={`left-${position.index}`}
						onMouseEnter={() => setActiveTool(position.index)}
						initial={{opacity: 0, x: -20}}
						animate={{opacity: 1, x: 0}}
						transition={{delay: i * 0.05, duration: 0.3}}
						className={`
          absolute px-5 py-2.5 rounded-full shadow-sm border flex items-center justify-center 
          text-sm font-semibold z-20 whitespace-nowrap transition-all duration-200 cursor-pointer
          ${
				activeTool === position.index
					? "bg-[#dfff4f] border-[#dfff4f] text-black scale-105 shadow-md"
					: "bg-white border-black/5 text-black/70 hover:bg-[#dfff4f] hover:border-[#dfff4f] hover:text-black hover:scale-105 hover:shadow-md"
			}
        `}
						style={{top: position.top, right: position.right}}>
						{tools[position.index].name}
					</motion.button>
				))}

				{/* Right Side Tool Pills */}
				{rightTools.map((position, i) => (
					<motion.button
						key={`right-${position.index}`}
						onMouseEnter={() => setActiveTool(position.index)}
						initial={{opacity: 0, x: 20}}
						animate={{opacity: 1, x: 0}}
						transition={{delay: i * 0.05, duration: 0.3}}
						className={`
          absolute px-5 py-2.5 rounded-full shadow-sm border flex items-center justify-center 
          text-sm font-semibold z-20 whitespace-nowrap transition-all duration-200 cursor-pointer
          ${
				activeTool === position.index
					? "bg-[#dfff4f] border-[#dfff4f] text-black scale-105 shadow-md"
					: "bg-white border-black/5 text-black/70 hover:bg-[#dfff4f] hover:border-[#dfff4f] hover:text-black hover:scale-105 hover:shadow-md"
			}
        `}
						style={{top: position.top, left: position.left}}>
						{tools[position.index].name}
					</motion.button>
				))}
			</div>
		</section>
	);
}
