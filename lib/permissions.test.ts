import { describe, expect, it, vi } from "vitest";

import { ForbiddenError, NotFoundError } from "@/lib/errors";
import {
  assertListAccess,
  assertProjectAccess,
  getListForUser,
  getProjectForUser,
} from "@/lib/permissions";

function createMockDb() {
  return {
    project: {
      findFirst: vi.fn(),
    },
    todoList: {
      findFirst: vi.fn(),
    },
    todoItem: {
      findFirst: vi.fn(),
    },
    section: {
      findFirst: vi.fn(),
    },
  };
}

describe("permissions", () => {
  it("returns project when owned by user", async () => {
    const db = createMockDb();
    const project = { id: "p1", userId: "u1", name: "Test", sortOrder: 0 };
    db.project.findFirst.mockResolvedValue(project);

    const result = await getProjectForUser("u1", "p1", db as never);
    expect(result).toEqual(project);
    expect(db.project.findFirst).toHaveBeenCalledWith({
      where: { id: "p1", userId: "u1" },
    });
  });

  it("assertProjectAccess throws when project missing", async () => {
    const db = createMockDb();
    db.project.findFirst.mockResolvedValue(null);
    await expect(assertProjectAccess("u1", "p1", db as never)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("getListForUser scopes by user via project", async () => {
    const db = createMockDb();
    const list = {
      id: "l1",
      projectId: "p1",
      title: "List",
      sortOrder: 0,
      project: { id: "p1", userId: "u1" },
    };
    db.todoList.findFirst.mockResolvedValue(list);

    const result = await getListForUser("u1", "l1", db as never);
    expect(result).toEqual(list);
  });

  it("assertListAccess throws for cross-user list", async () => {
    const db = createMockDb();
    db.todoList.findFirst.mockResolvedValue(null);
    await expect(assertListAccess("u2", "l1", db as never)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("error types", () => {
  it("forbidden and not found have codes", () => {
    expect(new ForbiddenError().code).toBe("FORBIDDEN");
    expect(new NotFoundError().code).toBe("NOT_FOUND");
  });
});
