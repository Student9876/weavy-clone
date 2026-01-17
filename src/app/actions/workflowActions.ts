"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to ensure User exists in our DB before acting
async function ensureUserExists(userId: string) {
    // 1. Check if user exists in DB
    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    // 2. If not, fetch details from Clerk and create them
    if (!dbUser) {
        const clerkUser = await currentUser();
        if (!clerkUser) throw new Error("User not found in Clerk");

        await prisma.user.create({
            data: {
                id: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
            },
        });
    }
}

export async function saveWorkflowAction({ id, name, nodes, edges }: any) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        // FIX: Sync User to DB before creating workflow
        await ensureUserExists(userId);

        const workflowData = { nodes, edges }; // JSON data

        if (id) {
            // UPDATE Existing
            console.log(`Updating Workflow ID: ${id}`);

            // Ensure ID is an Integer (Prisma Schema uses Int)
            const numericId = typeof id === "string" ? parseInt(id) : id;

            const workflow = await prisma.workflow.update({
                where: {
                    id: numericId,
                    userId: userId // Security: Ensure ownership
                },
                data: {
                    name,
                    data: workflowData,
                },
            });

            revalidatePath("/workflows");
            return { success: true, id: workflow.id.toString() };

        } else {
            // CREATE New
            console.log(`Creating New Workflow for: ${userId}`);

            const workflow = await prisma.workflow.create({
                data: {
                    name,
                    data: workflowData,
                    userId, // Connects strictly to the user
                },
            });

            revalidatePath("/workflows");
            return { success: true, id: workflow.id.toString() };
        }

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to save workflow." };
    }
}

export async function loadWorkflowAction(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: parseInt(id),
                userId: userId // Security check
            },
        });

        if (!workflow) return { success: false, error: "Workflow not found" };

        // Cast the JSON data back to what the frontend expects
        const graphData = workflow.data as any;

        return {
            success: true,
            data: graphData,
            name: workflow.name,
        };

    } catch (error) {
        console.error("Load Error:", error);
        return { success: false, error: "Failed to load workflow." };
    }
}

export async function getAllWorkflowsAction() {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized", workflows: [] };

        const workflows = await prisma.workflow.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                updatedAt: true,
                createdAt: true,
            }
        });

        // Convert Int ID to String for Frontend compatibility
        const formattedWorkflows = workflows.map(wf => ({
            ...wf,
            id: wf.id.toString(),
            updated_at: wf.updatedAt.toISOString(), // Normalize Date to String
        }));

        return { success: true, workflows: formattedWorkflows };

    } catch (error) {
        console.error("Fetch Workflows Error:", error);
        return { success: false, error: "Failed to fetch workflows.", workflows: [] };
    }
}

export async function deleteWorkflowAction(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        await prisma.workflow.delete({
            where: {
                id: parseInt(id),
                userId: userId,
            },
        });

        revalidatePath("/workflows");
        return { success: true };

    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, error: "Failed to delete workflow." };
    }
}