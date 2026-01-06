"use server";

import { query } from "@/lib/db";
import { AppNode } from "@/lib/types";
import { Edge } from "@xyflow/react";

type SaveWorkflowParams = {
    id?: string | null;
    name: string;
    nodes: AppNode[];
    edges: Edge[];
};

export async function saveWorkflowAction({ id, name, nodes, edges }: SaveWorkflowParams) {
    try {
        const workflowJson = JSON.stringify({ nodes, edges });

        if (id) {
            // --- UPDATE EXISTING ---
            console.log(`🔒 Updating Workflow ID: ${id}`);
            const sql = `
            UPDATE workflows 
            SET data = $1, name = $2 
            WHERE id = $3 
            RETURNING id;
        `;
            // Ensure ID is parsed as integer if your DB uses SERIAL
            await query(sql, [workflowJson, name, id]);
            return { success: true, id };

        } else {
            // --- CREATE NEW ---
            console.log("🔒 Creating New Workflow");
            const sql = `
            INSERT INTO workflows (name, data) 
            VALUES ($1, $2)
            RETURNING id;
        `;
            const result = await query(sql, [name, workflowJson]);
            return { success: true, id: result.rows[0].id };
        }

    } catch (error: any) {
        console.error("❌ Database Error:", error);
        return { success: false, error: "Failed to save workflow." };
    }
}

export async function loadWorkflowAction(id: string) {
    try {
        const sql = `SELECT data FROM workflows WHERE id = $1`;
        const result = await query(sql, [id]);

        if (result.rows.length === 0) {
            return { success: false, error: "Workflow not found" };
        }

        return { success: true, data: result.rows[0].data };
    } catch (error: any) {
        console.error("❌ Load Error:", error);
        return { success: false, error: "Failed to load workflow." };
    }
}