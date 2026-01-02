import Link from "next/link";

export default function MarketingLayout({children}: {children: React.ReactNode}) {
	return (
		// Use a slightly off-white background for the main page content
		<div className="min-h-screen flex flex-col bg-[#FBFBFB] selection:bg-yellow-200">
			{/* Navbar - Sticky & Blur with exact styling */}
			<header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
				<div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
					{/* Logo Section */}
					<div className="flex items-center">
						<div className="w-7 h-7 bg-black rounded-[4px] flex items-center justify-center">
							{/* Simple abstract logo representation */}
							<div className="w-3 h-3 border-2 border-white rounded-sm"></div>
						</div>
						<span className="font-bold text-xl tracking-tight ml-2.5">Weavy</span>
						<div className="h-4 w-[1px] bg-black/10 mx-3"></div>
						<span className="text-[11px] font-medium tracking-wider text-black/60 uppercase">Artistic Intelligence</span>
					</div>

					{/* Desktop Navigation Links */}
					<nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-black/70">
						<Link href="#" className="hover:text-black transition-colors">
							COLLECTIVE
						</Link>
						<Link href="#" className="hover:text-black transition-colors">
							ENTERPRISE
						</Link>
						<Link href="#" className="hover:text-black transition-colors">
							PRICING
						</Link>
						<Link href="#" className="hover:text-black transition-colors">
							REQUEST A DEMO
						</Link>
						<Link href="/login" className="hover:text-black transition-colors">
							SIGN IN
						</Link>
					</nav>

					{/* Action Button */}
					<Link
						href="/editor"
						className="bg-[#dfff4f] text-black px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#ccff00] transition-all active:scale-95">
						Start Now
					</Link>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="flex-1">{children}</main>
		</div>
	);
}
