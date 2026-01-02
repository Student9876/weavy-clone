import Navbar from "@/components/marketing/Navbar";
import LandingPage from "@/app/(marketing)/page"; // Import the content

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-[#FBFBFB] selection:bg-yellow-200">
			{/* Manually render Navbar here since we are outside (marketing) layout */}
			<Navbar />

			<main className="flex-1">
				<LandingPage />
			</main>
		</div>
	);
}
