import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
import * as Crypto from "expo-crypto";

import { Todo } from "../models/Todo";
import { schema } from "./schema";

const adapter = new SQLiteAdapter({
  schema,
  jsi: true /* enable if Platform.OS === 'ios' */,
});

export const database = new Database({
  adapter,
  modelClasses: [Todo],
});

setGenerator(() => Crypto.randomUUID());
