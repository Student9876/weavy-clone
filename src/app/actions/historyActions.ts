"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflowHistoryAction(workflowId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        // 👇 DEBUG LOGS: Check the Server Console when you open the sidebar
        console.log(`🔍 Fetching History for Workflow: ${workflowId}`);
        console.log(`👤 User ID: ${userId}`);

        // Fetch the runs with their detailed node executions
        const runs = await prisma.workflowRun.findMany({
            where: {
                workflowId: parseInt(workflowId),
                // workflow: { userId }, // Comment this out temporarily to debug ownership issues
            },
            include: {
                nodeExecutions: {
                    orderBy: { startedAt: "asc" },
                },
            },
            orderBy: { startedAt: "desc" },
        });

        console.log(`✅ Found ${runs.length} runs in the database.`);

        const formattedRuns = runs.map((run) => ({
            id: run.id,
            status: run.status,
            triggerType: run.triggerType,
            startedAt: run.startedAt.toISOString(),
            finishedAt: run.finishedAt?.toISOString() || null,
            duration: run.finishedAt
                ? Math.round((run.finishedAt.getTime() - run.startedAt.getTime()) / 1000) + "s"
                : "...",
            nodes: run.nodeExecutions.map((node) => ({
                id: node.id,
                nodeId: node.nodeId,
                type: node.nodeType,
                status: node.status,
                input: node.inputData,
                output: node.outputData,
                error: node.error,
                duration: node.finishedAt
                    ? ((node.finishedAt.getTime() - node.startedAt.getTime()) / 1000).toFixed(2) + "s"
                    : null
            })),
        }));

        return { success: true, runs: formattedRuns };

    } catch (error) {
        console.error("Fetch History Error:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}