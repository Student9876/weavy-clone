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
            console.log(`🔒 Updating Workflow ID: ${id}`);
            const sql = `
            UPDATE workflows 
            SET data = $1, name = $2 
            WHERE id = $3 
            RETURNING id;
        `;
            await query(sql, [workflowJson, name, id]);
            return { success: true, id };

        } else {
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
        const sql = `SELECT name, data FROM workflows WHERE id = $1`;
        const result = await query(sql, [id]);

        if (result.rows.length === 0) {
            return { success: false, error: "Workflow not found" };
        }

        return {
            success: true,
            data: result.rows[0].data,
            name: result.rows[0].name
        };
    } catch (error: any) {
        console.error("❌ Load Error:", error);
        return { success: false, error: "Failed to load workflow." };
    }
}

export async function getAllWorkflowsAction() {
    try {
        const sql = `
            SELECT id, name, created_at 
            FROM workflows 
            ORDER BY created_at DESC
        `;
        const result = await query(sql);

        return {
            success: true,
            workflows: result.rows
        };
    } catch (error: any) {
        console.error("❌ Fetch Workflows Error:", error);
        return { success: false, error: "Failed to fetch workflows.", workflows: [] };
    }
}

export async function deleteWorkflowAction(id: string) {
    try {
        const sql = `DELETE FROM workflows WHERE id = $1 RETURNING id`;
        const result = await query(sql, [id]);

        if (result.rows.length === 0) {
            return { success: false, error: "Workflow not found" };
        }

        return { success: true };
    } catch (error: any) {
        console.error("❌ Delete Error:", error);
        return { success: false, error: "Failed to delete workflow." };
    }
}