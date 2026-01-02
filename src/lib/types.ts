import { Node } from "@xyflow/react";

// =========================================
// 1. LANDING PAGE TYPES (Marketing)
// =========================================

export interface HeroNodeData extends Record<string, unknown> {
    label?: string;
    type?: string;       // e.g., "3D", "Image", "Text"
    image?: string;      // URL for the image content
    text?: string;       // Content for text nodes
    width?: string;      // Tailwind class override (e.g., "w-[300px]")
    height?: string;     // Tailwind class override (e.g., "aspect-video")
    gradientClass?: string; // For the Color Reference node
}

// The specific Node type for the Hero section
export type HeroNode = Node<HeroNodeData>;


// =========================================
// 2. EDITOR APP TYPES (The Actual Tool)
// =========================================

// Common properties shared by ALL nodes in the editor
export interface BaseNodeData extends Record<string, unknown> {
    label?: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    errorMessage?: string;

    // UI State
    isLocked?: boolean;      // Prevent dragging/editing
    isRenaming?: boolean;    // Toggle input field for header
}

// -- Text Input Node --
export interface TextNodeData extends BaseNodeData {
    text: string;
    isExpandable?: boolean;
}

// -- Image Upload Node --
export interface ImageNodeData extends BaseNodeData {
    file?: {
        name: string;
        type: string;
        url: string;           // Blob URL or S3 link
    };
    inputType: 'upload' | 'url';
}

// -- LLM / Generation Node --
export interface LLMNodeData extends BaseNodeData {
    // Configuration
    model: 'gemini-pro' | 'gemini-1.5-flash' | 'gemini-pro-vision';
    temperature: number;
    systemInstruction?: string;
    maxTokens?: number;

    // History / Results
    outputs: Array<{
        id: string;
        type: 'text' | 'image';
        content: string;       // The text response or Image URL
        timestamp: number;
        meta?: {
            creditsCost?: number;
            seed?: number;
        };
    }>;

    // View State
    activeOutputId?: string; // Currently displayed generation
    viewMode: 'single' | 'list';
}

// Union type for the Editor
export type AppNodeData = TextNodeData | ImageNodeData | LLMNodeData;
export type AppNode = Node<AppNodeData>;