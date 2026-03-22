import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: "todos",
      columns: [
        { name: "title", type: "string", isIndexed: true },
        { name: "is_completed", type: "boolean" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "user_id", type: "string" },
      ],
    }),
  ],
});
