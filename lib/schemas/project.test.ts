import { describe, expect, it } from "vitest";

import {
  createProjectSchema,
  updateProjectNotesSchema,
} from "@/lib/schemas/project";

describe("createProjectSchema", () => {
  it("rejects a blank name", () => {
    const result = createProjectSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectNotesSchema", () => {
  it("accepts null notes", () => {
    const result = updateProjectNotesSchema.safeParse({ notes: null });
    expect(result.success).toBe(true);
  });

  it("rejects notes longer than 50000 characters", () => {
    const result = updateProjectNotesSchema.safeParse({
      notes: "a".repeat(50_001),
    });
    expect(result.success).toBe(false);
  });
});
