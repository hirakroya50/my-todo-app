import { describe, expect, it, vi } from "vitest";

import { linkUrlSchema, reorderSchema } from "@/lib/schemas/common";

describe("linkUrlSchema", () => {
  it("accepts http in development", () => {
    const schema = linkUrlSchema();
    expect(schema.safeParse("http://localhost:43123").success).toBe(true);
  });

  it("requires https in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      const schema = linkUrlSchema();
      expect(schema.safeParse("https://example.com").success).toBe(true);
      expect(schema.safeParse("http://example.com").success).toBe(false);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("parses reorder input", () => {
    const result = reorderSchema.safeParse({
      orders: [{ id: "clp9x9y9z0000abcdefghijk", sortOrder: 0 }],
    });
    expect(result.success).toBe(true);
  });
});
