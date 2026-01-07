import { AppNode } from "./types";
import { Edge } from "@xyflow/react";

export const DEMO_WORKFLOWS = [
    {
        id: "demo-product-listing",
        name: "Product Listing Generator",
        description: "Generate SEO, Social, and Description from product images.",
        thumbnail: "🛍️",
        getGraph: (): { nodes: AppNode[], edges: Edge[] } => {
            const nodes: AppNode[] = [
                // 1. INPUTS (3 Images) - Using local demo images

                {
                    id: 'img-1',
                    type: 'imageNode',
                    position: { x: 0, y: 0 },
                    data: {
                        label: 'Front View',
                        status: 'success',
                        inputType: 'upload',
                        image: '/demo/shoe-front.jpg'
                    }
                },
                {
                    id: 'img-2',
                    type: 'imageNode',
                    position: { x: 0, y: 350 },
                    data: {
                        label: 'Side View',
                        status: 'success',
                        inputType: 'upload',
                        image: '/demo/shoe-side.jpg'
                    }
                },
                {
                    id: 'img-3',
                    type: 'imageNode',
                    position: { x: 0, y: 700 },
                    data: {
                        label: 'Detail View',
                        status: 'success',
                        inputType: 'upload',
                        image: '/demo/shoe-detail.jpg'
                    }
                },

                // -----------------------------------------------------------
                // 2. THE PROMPTS (Instructions as Text Nodes) 
                // -----------------------------------------------------------
                {
                    id: 'prompt-merger',
                    type: 'textNode',
                    position: { x: 250, y: 150 },
                    data: {
                        label: 'Analyst Instructions',
                        status: 'idle',
                        text: `You are a Senior Product Analyst. Analyze these 3 product images (Front, Side, Detail). 
                        
Output a detailed technical specification of this product. Include:
1. Color palette and Materials (be specific).
2. Design features (sole type, stitching, branding).
3. Functional benefits (breathability, support).
4. Target demographic and style category.

Do not write marketing copy yet. Just output the raw facts and visual details.`
                    }
                },

                {
                    id: 'prompt-seo',
                    type: 'textNode',
                    position: { x: 750, y: -100 },
                    data: {
                        label: 'SEO Rules',
                        status: 'idle',
                        text: `You are an SEO Expert. 
Based on the provided product analysis, generate a JSON list of 20 high-traffic keywords and 3 meta-descriptions (160 chars max) optimized for Google Shopping.`
                    }
                },

                {
                    id: 'prompt-desc',
                    type: 'textNode',
                    position: { x: 750, y: 250 },
                    data: {
                        label: 'Copy Style',
                        status: 'idle',
                        text: `You are a Senior Copywriter. 
Using the provided product specs, write a compelling Amazon Product Description. Use bullet points for features and an engaging, energetic tone.`
                    }
                },

                {
                    id: 'prompt-social',
                    type: 'textNode',
                    position: { x: 750, y: 600 },
                    data: {
                        label: 'Social Strategy',
                        status: 'idle',
                        text: `You are a Social Media Influencer. 
Create 3 variations of an Instagram caption based on these product details. Include relevant emojis and a call to action. Keep it trendy and short.`
                    }
                },

                // -----------------------------------------------------------
                // 3. THE LLMs
                // -----------------------------------------------------------
                {
                    id: 'llm-merger',
                    type: 'llmNode',
                    position: { x: 500, y: 300 },
                    data: {
                        label: 'Vision Analyst',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        imageHandleCount: 3,
                        outputs: [],
                        temperature: 0.4,
                        viewMode: 'single',
                        systemPrompt: ""
                    }
                },

                {
                    id: 'text-seo',
                    type: 'llmNode',
                    position: { x: 1000, y: 0 },
                    data: {
                        label: 'SEO Specialist',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.2,
                        viewMode: 'single',
                        imageHandleCount: 0,
                        systemPrompt: ""
                    }
                },
                {
                    id: 'text-desc',
                    type: 'llmNode',
                    position: { x: 1000, y: 350 },
                    data: {
                        label: 'Copywriter',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.8,
                        viewMode: 'single',
                        imageHandleCount: 0,
                        systemPrompt: ""
                    }
                },
                {
                    id: 'text-social',
                    type: 'llmNode',
                    position: { x: 1000, y: 700 },
                    data: {
                        label: 'Social Manager',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.9,
                        viewMode: 'single',
                        imageHandleCount: 0,
                        systemPrompt: ""
                    }
                },
            ];

            const edges: Edge[] = [
                // Connect Images to Merger
                { id: 'e1', source: 'img-1', target: 'llm-merger', targetHandle: 'image-0', type: 'animatedEdge', animated: true },
                { id: 'e2', source: 'img-2', target: 'llm-merger', targetHandle: 'image-1', type: 'animatedEdge', animated: true },
                { id: 'e3', source: 'img-3', target: 'llm-merger', targetHandle: 'image-2', type: 'animatedEdge', animated: true },

                // Connect PROMPTS to LLMs
                { id: 'p1', source: 'prompt-merger', target: 'llm-merger', targetHandle: 'system-prompt', type: 'default' },
                { id: 'p2', source: 'prompt-seo', target: 'text-seo', targetHandle: 'system-prompt', type: 'default' },
                { id: 'p3', source: 'prompt-desc', target: 'text-desc', targetHandle: 'system-prompt', type: 'default' },
                { id: 'p4', source: 'prompt-social', target: 'text-social', targetHandle: 'system-prompt', type: 'default' },

                // Connect Merger Output to Downstream LLMs
                { id: 'e4', source: 'llm-merger', sourceHandle: 'response', target: 'text-seo', targetHandle: 'prompt', type: 'animatedEdge', animated: true },
                { id: 'e5', source: 'llm-merger', sourceHandle: 'response', target: 'text-desc', targetHandle: 'prompt', type: 'animatedEdge', animated: true },
                { id: 'e6', source: 'llm-merger', sourceHandle: 'response', target: 'text-social', targetHandle: 'prompt', type: 'animatedEdge', animated: true },
            ];

            return { nodes, edges };
        }
    }
];