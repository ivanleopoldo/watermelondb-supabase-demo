import { Model } from "@nozbe/watermelondb";
import { field, text, writer } from "@nozbe/watermelondb/decorators";

export class Todo extends Model {
	static table = "todos";
	// @ts-expect-error
	@text("title") title!: string;
	// @ts-expect-error
	@field("is_completed") isCompleted!: boolean;
	// @ts-expect-error
	@writer async toggleCompleted() {
		await this.update((todo) => {
			todo.isCompleted = !todo.isCompleted;
		});
	}
}

export type TTodo = {
	title: string;
	isCompleted: boolean;
};
