"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ListToolbar({
  searchQuery,
  onSearchChange,
  filterIncomplete,
  onFilterIncompleteChange,
  onExpandAll,
  onCollapseAll,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterIncomplete: boolean;
  onFilterIncompleteChange: (v: boolean) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <Input
        className="max-w-xs"
        placeholder="Search items…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button
        type="button"
        size="sm"
        variant={filterIncomplete ? "default" : "outline"}
        onClick={() => onFilterIncompleteChange(!filterIncomplete)}
      >
        Incomplete only
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onExpandAll}>
        Expand all
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onCollapseAll}>
        Collapse all
      </Button>
    </div>
  );
}
