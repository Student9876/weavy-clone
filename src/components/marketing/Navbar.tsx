"use client";

import {useState} from "react";
import Link from "next/link";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const {scrollY} = useScroll();

	// Monitor scroll position to toggle state
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (latest > 100 && !isScrolled) {
			setIsScrolled(true);
		} else if (latest <= 50 && isScrolled) {
			setIsScrolled(false);
		}
	});

	return (
		<motion.header
			className="fixed w-full top-0 z-50 border-transparent bg-transparent"
			style={{
				height: isScrolled ? "60px" : "100px",
			}}
			transition={{duration: 0.3, ease: "easeInOut"}}>
			<div className="mx-auto h-full flex items-start justify-between">
				{/* Left: Logo Group */}
				<div className="flex items-center gap-4">
					<div className="w-8 h-8 bg-black rounded-[4px] flex items-center justify-center">
						<div className="w-3.5 h-3.5 border-[2.5px] border-white rounded-[2px]"></div>
					</div>

					<div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
						<span className="font-bold text-2xl tracking-tight leading-none">Weavy</span>

						{/* The vertical divider line */}
						<div className="hidden md:block h-5 w-[1px] bg-black/10"></div>

						<span className="text-[10px] md:text-[11px] font-semibold tracking-widest text-black/60 uppercase leading-none mt-0.5">
							Artistic
							<br className="md:hidden" /> Intelligence
						</span>
					</div>
				</div>

				{/* Right Side Container */}
				<div className="flex items-start gap-4 ml-auto">
					{/* Navigation Links - Hidden on mobile */}
					<nav className="flex items-center text-[13px] text-black/70 tracking-wide">
						{/* Show all items above 840px */}
						<div className="flex gap-4 max-[840px]:hidden">
							{["COLLECTIVE", "ENTERPRISE", "PRICING", "REQUEST A DEMO", "SIGN IN"].map((item) => (
								<Link key={item} href={item === "SIGN IN" ? "/login" : "#"} className="hover:text-black transition-colors font-bold">
									{item}
								</Link>
							))}
						</div>
						{/* Show only PRICING and SIGN IN at 840px and below */}
						<div className="hidden gap-4 max-[840px]:flex">
							{["PRICING", "SIGN IN"].map((item) => (
								<Link key={item} href={item === "SIGN IN" ? "/login" : "#"} className="hover:text-black transition-colors font-bold">
									{item}
								</Link>
							))}
						</div>
					</nav>

					{/* Big "Start Now" Button - Animates Size */}
					<motion.div
						animate={{
							scale: isScrolled ? 0.9 : 1,
						}}
						transition={{duration: 0.3}}
						className="flex items-center">
						<Link
							href="/editor"
							className={`
    transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
    shadow-sm hover:bg-[#ccff00] active:scale-95
    cursor-pointer select-none
    font-dmsans font-normal text-black
    bg-[#f7ff9e] flex items-end justify-start whitespace-nowrap h-full
    ${isScrolled ? "h-12 py-1 text-lg leading-none" : "h-[89.9px] w-[202px] pt-[10px] pb-[7.92px] pl-[12.76px] pr-[24.36px] text-[40px] leading-[40px]"}
  `}
							style={{
								boxSizing: "border-box",
								maxWidth: "100%",
								WebkitFontSmoothing: "antialiased",
							}}>
							<motion.span
								animate={{
									marginTop: isScrolled ? 0 : 24, // 24px ≈ mt-6
								}}
								transition={{duration: 0.3, ease: "easeInOut"}}
								className="block w-full text-left">
								Start Now
							</motion.span>
						</Link>
					</motion.div>
				</div>
			</div>
		</motion.header>
	);
}
