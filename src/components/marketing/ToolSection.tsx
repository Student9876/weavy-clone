"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";

export default function ToolSection() {
	const [activeTool, setActiveTool] = useState(0);

	const tools = [
		{name: "Crop", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563af147b5d7c2496ff_Crop%402x.avif"},
		{name: "Inpaint", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245639e16941f61edcc06_Inpaint%402x.avif"},
		{name: "Upscale", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245638e6550c59d0bce8f_Upscale%402x.avif"},
		{name: "Outpaint", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6822456436dd3ce4b39b6372_Outpaint%402x.avif"},
		{name: "Mask Extractor", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d5cb54c747f189ae_Mask%402x.avif"},
		{name: "Relight", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563b4846eaa2d70f69e_Relight%402x.avif"},
		{name: "Invert", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif"},
		{name: "Image Describer", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825ab42a8f361a9518d5a7f_Image%20describer%402x.avif"},
		{name: "Channels", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245646909d06ed8a17f4d_Channels%402x.avif"},
		{name: "Painter", image: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif"},
	];

	type ToolPosition = {index: number; top: string; right: string; left?: undefined} | {index: number; top: string; left: string; right?: undefined};

	const leftTools: ToolPosition[] = [
		{index: 0, top: "15%", right: "calc(50% + 260px)"},
		{index: 1, top: "30%", right: "calc(50% + 300px)"},
		{index: 2, top: "45%", right: "calc(50% + 260px)"},
		{index: 3, top: "60%", right: "calc(50% + 320px)"},
		{index: 4, top: "75%", right: "calc(50% + 240px)"},
	];

	const rightTools: ToolPosition[] = [
		{index: 5, top: "20%", left: "calc(50% + 260px)"},
		{index: 6, top: "35%", left: "calc(50% + 300px)"},
		{index: 7, top: "50%", left: "calc(50% + 250px)"},
		{index: 8, top: "65%", left: "calc(50% + 290px)"},
		{index: 9, top: "80%", left: "calc(50% + 240px)"},
	];

	return (
		<section className="items-center justify-center">
			{/* Background Grid */}
			<div className="absolute inset-0 pointer-events-none" />

			{/* Fade Gradients */}
			<div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#FBFBFB] via-[#FBFBFB]/90 to-transparent pointer-events-none z-10" /> 
			<div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#FBFBFB] via-[#FBFBFB]/90 to-transparent pointer-events-none z-10" />

			{/* Header */}
			<div className="max-w-[1600px] mx-auto text-center mb-16 relative z-20">
				<h2 className="text-[6vw] md:text-[4vw] font-medium tracking-[-0.03em] text-black leading-[1.1] mb-6">
					With all the professional <br /> tools you rely on
				</h2>
				<p className="text-black/60 text-lg md:text-xl font-medium tracking-wide">In one seamless workflow</p>
			</div>

			{/* Interactive Tool Area */}
			<div className="relative w-full max-w-[1600px] h-[700px] z-20">
				{/* Central Image Container - Static */}
				{/* <div className=""> */}
				<Image src={tools[activeTool].image} alt={tools[activeTool].name} fill className="object-cover" priority />
				{/* </div> */}

				{/* Render Helper for Buttons */}
				{[...leftTools, ...rightTools].map((pos) => (
					<motion.button
						key={pos.index}
						onMouseEnter={() => setActiveTool(pos.index)}
						initial={{opacity: 0, y: 10}}
						whileInView={{opacity: 1, y: 0}}
						viewport={{once: true}}
						transition={{delay: 0.1, duration: 0.3}}
						className={`
              absolute px-6 py-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border flex items-center justify-center 
              text-[15px] font-semibold z-20 whitespace-nowrap transition-all duration-200 cursor-pointer
              ${
					activeTool === pos.index
						? "bg-[#dfff4f] border-[#dfff4f] text-black scale-110 shadow-md"
						: "bg-white border-black/5 text-black/70 hover:bg-[#dfff4f] hover:border-[#dfff4f] hover:text-black hover:scale-105 hover:shadow-md"
				}
            `}
						style={{
							top: pos.top,
							left: pos.left,
							right: pos.right,
						}}>
						{tools[pos.index].name}
					</motion.button>
				))}
			</div>
		</section>
	);
}
