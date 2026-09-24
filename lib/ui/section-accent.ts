const ACCENTS = [
  "border-l-indigo-500 bg-indigo-500/5",
  "border-l-violet-500 bg-violet-500/5",
  "border-l-purple-500 bg-purple-500/5",
  "border-l-fuchsia-500 bg-fuchsia-500/5",
  "border-l-sky-500 bg-sky-500/5",
  "border-l-emerald-500 bg-emerald-500/5",
  "border-l-amber-500 bg-amber-500/5",
  "border-l-rose-500 bg-rose-500/5",
] as const;

export function getSectionAccent(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}
