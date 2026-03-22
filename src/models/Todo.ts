import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  readonly,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";

export class Todo extends Model {
  static table = "todos";

  // @ts-expect-error
  @readonly @date("created_at") createdAt!: Date;
  // @ts-expect-error
  @readonly @date("updated_at") updatedAt!: Date;
  // @ts-expect-error
  @date("deleted_at") deletedAt;
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
