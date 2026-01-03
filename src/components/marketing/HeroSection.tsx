import HeroWorkflow from "@/components/marketing/HeroWorkflow";
export default function HeroSection() {
	return (
		<section className=" relative min-h-[120vh] flex flex-col pt-32 px-6 overflow-hidden">
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

				{/* Bottom Fade Overlay (to blend with next section if needed)
				 */}
				{/* <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#f0efe9] to-transparent z-20 pointer-events-none" /> */}
			</div>
		</section>
	);
}
