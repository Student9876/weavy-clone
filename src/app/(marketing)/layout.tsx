

export default function MarketingLayout({children}: {children: React.ReactNode}) {
	return (
		// The bg-[#FBFBFB] applies the off-white background to the whole page
		<div className="min-h-screen flex flex-col bg-[#FBFBFB] selection:bg-yellow-200">
			<main className="flex-1">{children}</main>
		</div>
	);
}
