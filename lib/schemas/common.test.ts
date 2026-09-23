import { describe, expect, it } from "vitest";

import { linkUrlSchema, reorderSchema } from "@/lib/schemas/common";

describe("linkUrlSchema", () => {
  it("accepts http in development", () => {
    const schema = linkUrlSchema();
    expect(schema.safeParse("http://localhost:43123").success).toBe(true);
  });

  it("parses reorder input", () => {
    const result = reorderSchema.safeParse({
      orders: [{ id: "clp9x9y9z0000abcdefghijk", sortOrder: 0 }],
    });
    expect(result.success).toBe(true);
  });
});
