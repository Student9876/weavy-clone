import { AppNode } from "./types";
import { Edge } from "@xyflow/react";

export const DEMO_WORKFLOWS = [
    {
        id: "demo-product-listing",
        name: "Product Listing Generator",
        description: "Generate SEO descriptions from product images.",
        thumbnail: "Product",
        getGraph: (): { nodes: AppNode[], edges: Edge[] } => {
            const nodes: AppNode[] = [
                // 1. Inputs (3 Images) - Added 'inputType'
                {
                    id: 'img-1',
                    type: 'imageNode',
                    position: { x: 0, y: 0 },
                    data: { label: 'Front View', status: 'idle', inputType: 'upload' }
                },
                {
                    id: 'img-2',
                    type: 'imageNode',
                    position: { x: 0, y: 300 },
                    data: { label: 'Side View', status: 'idle', inputType: 'upload' }
                },
                {
                    id: 'img-3',
                    type: 'imageNode',
                    position: { x: 0, y: 600 },
                    data: { label: 'Detail View', status: 'idle', inputType: 'upload' }
                },

                // 2. The Processor (Vision Model) - Added 'temperature' and 'viewMode'
                {
                    id: 'llm-merger',
                    type: 'llmNode',
                    position: { x: 400, y: 250 },
                    data: {
                        label: 'Vision Analyzer',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        imageHandleCount: 3,
                        outputs: [],
                        temperature: 0.7,
                        viewMode: 'single'
                    }
                },

                // 3. The Outputs (3 Text Generators) - Added 'temperature', 'viewMode', 'imageHandleCount'
                {
                    id: 'text-seo',
                    type: 'llmNode',
                    position: { x: 900, y: 0 },
                    data: {
                        label: 'SEO Tags',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.7,
                        viewMode: 'single',
                        imageHandleCount: 1
                    }
                },
                {
                    id: 'text-desc',
                    type: 'llmNode',
                    position: { x: 900, y: 300 },
                    data: {
                        label: 'Product Description',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.7,
                        viewMode: 'single',
                        imageHandleCount: 1
                    }
                },
                {
                    id: 'text-social',
                    type: 'llmNode',
                    position: { x: 900, y: 600 },
                    data: {
                        label: 'Instagram Caption',
                        status: 'idle',
                        model: 'gemini-2.5-flash',
                        outputs: [],
                        temperature: 0.7,
                        viewMode: 'single',
                        imageHandleCount: 1
                    }
                },
            ];

            const edges: Edge[] = [
                // Connect Images to Merger
                { id: 'e1', source: 'img-1', target: 'llm-merger', targetHandle: 'image-0', type: 'animatedEdge', animated: true },
                { id: 'e2', source: 'img-2', target: 'llm-merger', targetHandle: 'image-1', type: 'animatedEdge', animated: true },
                { id: 'e3', source: 'img-3', target: 'llm-merger', targetHandle: 'image-2', type: 'animatedEdge', animated: true },

                // Connect Merger to Outputs
                { id: 'e4', source: 'llm-merger', target: 'text-seo', targetHandle: 'system-prompt', type: 'animatedEdge', animated: true },
                { id: 'e5', source: 'llm-merger', target: 'text-desc', targetHandle: 'system-prompt', type: 'animatedEdge', animated: true },
                { id: 'e6', source: 'llm-merger', target: 'text-social', targetHandle: 'system-prompt', type: 'animatedEdge', animated: true },
            ];

            return { nodes, edges };
        }
    }
];