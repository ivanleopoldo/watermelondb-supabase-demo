import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
	version: 2,
	tables: [
		tableSchema({
			name: "todos",
			columns: [
				{ name: "title", type: "string", isIndexed: true },
				{ name: "is_completed", type: "boolean" },
			],
		}),
	],
});
