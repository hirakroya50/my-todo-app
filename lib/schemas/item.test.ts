import { describe, expect, it } from "vitest";

import { createItemSchema, setCheckedSchema } from "@/lib/schemas/item";

describe("createItemSchema", () => {
  it("requires a title", () => {
    const result = createItemSchema.safeParse({ title: "  " });
    expect(result.success).toBe(false);
  });
});

describe("setCheckedSchema", () => {
  it("requires checked to be a boolean", () => {
    expect(setCheckedSchema.safeParse({ checked: true }).success).toBe(true);
    expect(setCheckedSchema.safeParse({ checked: "yes" }).success).toBe(false);
  });
});
