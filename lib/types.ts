import type {
  ItemAttachment,
  Project,
  Section,
  TodoItem,
  TodoList,
} from "@prisma/client";

export type TemplateDefinition = {
  version: string;
  sections: { title: string; items: string[] }[];
};

export type SectionWithItems = Section & { items: TodoItem[] };

export type ListTree = {
  list: TodoList;
  sections: SectionWithItems[];
  attachments: ItemAttachment[];
};

export type ProgressSummary = {
  total: number;
  done: number;
  percent: number;
};

export type SortOrderInput = { id: string; sortOrder: number };

export type TodoListWithProject = TodoList & { project: Project };
