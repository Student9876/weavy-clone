"use client";

import {useRef, useState} from "react";
import {motion, useScroll, useMotionValueEvent, useTransform} from "framer-motion";
import Image from "next/image";
import HeroSection from "@/components/marketing/HeroSection";
import StickyModelSection from "@/components/marketing/StickyModelSection";
import ToolSection from "@/components/marketing/ToolSection";
import EditorSection from "@/components/marketing/EditorSection";
import Footer from "@/components/marketing/Footer";

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
