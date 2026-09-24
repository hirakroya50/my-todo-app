import { describe, expect, it } from "vitest";

import { computeProgress } from "@/lib/progress";
import type { ListTree } from "@/lib/types";

function tree(items: { checked: boolean }[][]): ListTree {
  return {
    sections: items.map((sectionItems) => ({
      items: sectionItems,
    })),
  } as ListTree;
}

describe("computeProgress", () => {
  it("returns zeros for an empty list", () => {
    expect(computeProgress(tree([[]]))).toEqual({
      total: 0,
      done: 0,
      percent: 0,
    });
  });

  it("returns 50 percent when one of two items is checked", () => {
    expect(
      computeProgress(tree([[{ checked: true }, { checked: false }]])),
    ).toEqual({
      total: 2,
      done: 1,
      percent: 50,
    });
  });

  it("rounds one of three items to 33 percent", () => {
    expect(
      computeProgress(
        tree([
          [{ checked: true }, { checked: false }],
          [{ checked: false }],
        ]),
      ),
    ).toEqual({
      total: 3,
      done: 1,
      percent: 33,
    });
  });
});
