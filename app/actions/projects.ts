"use server";

import { revalidatePath } from "next/cache";

import { setLastProjectId } from "@/lib/cookies";
import { toActionError } from "@/lib/errors";
import {
  createProjectSchema,
  reorderProjectsSchema,
  updateProjectNotesSchema,
  updateProjectSchema,
} from "@/lib/schemas/project";
import * as projectService from "@/lib/services/project.service";
import { requireUserId } from "@/lib/session";

export async function createProjectAction(input: unknown) {
  try {
    const userId = await requireUserId();
    const data = createProjectSchema.parse(input);
    const { project, list } = await projectService.createProjectWithChecklist(
      userId,
      data.name,
    );
    await setLastProjectId(userId, project.id);
    revalidatePath("/projects");
    return { project, list };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateProjectNotesAction(
  projectId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = updateProjectNotesSchema.parse(input);
    await projectService.updateProjectNotes(userId, projectId, data.notes);
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`, "layout");
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}

export async function ensureProjectChecklistAction(projectId: string) {
  try {
    const userId = await requireUserId();
    const list = await projectService.ensureProjectChecklist(userId, projectId);
    return { list };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateProjectAction(projectId: string, input: unknown) {
  try {
    const userId = await requireUserId();
    const data = updateProjectSchema.parse(input);
    if (!data.name) return { error: "VALIDATION" };
    const project = await projectService.updateProject(
      userId,
      projectId,
      data.name,
    );
    revalidatePath("/projects");
    return { project };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    const userId = await requireUserId();
    await projectService.deleteProject(userId, projectId);
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}

export async function reorderProjectsAction(input: unknown) {
  try {
    const userId = await requireUserId();
    const data = reorderProjectsSchema.parse(input);
    await projectService.reorderProjects(userId, data.orders);
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
