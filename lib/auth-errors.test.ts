import { describe, expect, it } from "vitest";

import { authErrorMessage } from "@/lib/auth-errors";

describe("authErrorMessage", () => {
  it("returns null for empty input", () => {
    expect(authErrorMessage(undefined)).toBeNull();
    expect(authErrorMessage("")).toBeNull();
  });

  it("maps OAuthAccountNotLinked", () => {
    expect(authErrorMessage("OAuthAccountNotLinked")).toContain("email and password");
  });

  it("falls back for unknown codes", () => {
    expect(authErrorMessage("SomeNewError")).toBe(
      "Sign-in failed. Please try again.",
    );
  });
});
