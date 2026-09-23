import type { ListTree, ProgressSummary } from "@/lib/types";

export function computeProgress(tree: ListTree): ProgressSummary {
  let total = 0;
  let done = 0;
  for (const section of tree.sections) {
    for (const item of section.items) {
      total += 1;
      if (item.checked) done += 1;
    }
  }
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}
