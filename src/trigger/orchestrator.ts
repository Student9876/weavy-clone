import { task } from "@trigger.dev/sdk/v3";
import { aiGenerator } from "./workflow-nodes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NodeData {
    id: string;
    type: string; // React Flow types are strings like "llmNode", "textNode"
    data: any;
}

export const orchestrator = task({
    id: "workflow-orchestrator",
    run: async (payload: { runId: string }) => {
        const run = await prisma.workflowRun.findUnique({
            where: { id: payload.runId },
            include: { workflow: true },
        });

        if (!run) throw new Error(`Run ${payload.runId} not found`);

        // Cast to any to read the JSON structure safely
        const graph = run.workflow.data as any;
        const nodes: NodeData[] = graph.nodes || []; // Ensure nodes array exists

        console.log(`🚀 Starting execution for workflow: ${run.workflow.name} (Run ID: ${run.id})`);
        console.log(`📊 Found ${nodes.length} nodes in the graph.`);

        // Iterate and Execute
        for (const node of nodes) {
            // 👇 FIX 1: Check for the correct node type "llmNode"
            if (node.type !== "llmNode") {
                console.log(`Skipping node ${node.id} (Type: ${node.type})`);
                continue;
            }

            console.log(`Processing LLM Node: ${node.id}`);

            // Create "RUNNING" Record
            const executionRecord = await prisma.nodeExecution.create({
                data: {
                    runId: run.id,
                    nodeId: node.id,
                    nodeType: node.type,
                    status: "RUNNING",
                    startedAt: new Date(),
                    inputData: node.data ?? {},
                },
            });

            try {
                // Execute the AI Task
                // 👇 FIX 2: Ensure we read the prompt from the correct data field
                const promptText = node.data.prompt || node.data.text || "Explain Quantum Computing";

                const result = await aiGenerator.triggerAndWait({
                    prompt: promptText,
                });

                // Update DB with SUCCESS
                // 👇 FIX 3: Ensure 'result' is cast to 'any' for Prisma
                await prisma.nodeExecution.update({
                    where: { id: executionRecord.id },
                    data: {
                        status: "SUCCESS",
                        finishedAt: new Date(),
                        outputData: (result ?? {}) as any
                    },
                });

            } catch (error) {
                console.error(`Node ${node.id} failed:`, error);
                await prisma.nodeExecution.update({
                    where: { id: executionRecord.id },
                    data: {
                        status: "FAILED",
                        finishedAt: new Date(),
                        error: String(error)
                    },
                });
                // We catch and log, but maybe we don't want to crash the whole workflow? 
                // Throwing here stops the loop.
                throw error;
            }
        }

        // Mark the whole run as COMPLETED
        await prisma.workflowRun.update({
            where: { id: run.id },
            data: { status: "COMPLETED", finishedAt: new Date() }
        });

        return { status: "Workflow Completed", runId: run.id };
    },
});