import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { Pressable, type PressableProps } from "react-native";
import {
  Button,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/db";
import type { Todo } from "../models/Todo";

const todos = database.collections.get<Todo>("todos").query();

export default function Index() {
  const [title, setTitle] = useState("");
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const { user } = useAuth();

  const handleAddTodo = () => {
    if (user) {
      console.log(user.id);
      database.write(() => {
        return database.collections.get<Todo>("todos").create((todo) => {
          todo.title = title;
          todo.isCompleted = false;
          todo.userId = user.id;
        });
      });
    }
  };

  useEffect(() => {
    const subscription = todos.observe().subscribe((todos) => {
      setTodosList(todos);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ScrollView padding={10}>
      <YStack gap={10}>
        <XStack alignItems="center" gap={"$2"}>
          <Input
            value={title}
            returnKeyLabel="submit"
            submitBehavior="blurAndSubmit"
            onSubmitEditing={(e) => {
              if (!title) return;
              handleAddTodo();
              setTitle("");
              e.nativeEvent.text = "";
            }}
            onChangeText={setTitle}
            flex={1}
            placeholder={"Add a todo"}
          />
          <Button onPress={() => handleAddTodo()}>+</Button>
        </XStack>
        <Text color={"dimgray"} fontWeight="300">
          TODOS
        </Text>
        <TodoList todos={todosList} />
      </YStack>
    </ScrollView>
  );
}

const TodoList = ({ todos }: { todos: Todo[] }) => {
  const handleDeleteTodo = (todo: Todo) => {
    database.write(() => {
      return todo.markAsDeleted();
    });
  };
  return (
    <YGroup>
      {todos.map((todo: Todo) => {
        return (
          <YGroup.Item key={todo.id}>
            <EnhancedTodoItem
              onLongPress={() => handleDeleteTodo(todo)}
              onPress={() => todo.toggleCompleted()}
              todo={todo}
            />
          </YGroup.Item>
        );
      })}
    </YGroup>
  );
};

const TodoItem = ({
  todo,
  ...props
}: { title?: string; todo: Todo } & PressableProps) => {
  return (
    <Pressable {...props}>
      <View
        gap={"$2"}
        flexDirection="row"
        backgroundColor="$backgroundHover"
        borderRadius="$4"
        padding="$4"
        marginBottom="$2"
      >
        <Text>{todo.isCompleted ? "✅ " : "⬜️ "}</Text>
        <Text>{todo.title}</Text>
      </View>
    </Pressable>
  );
};

const enhanced = withObservables(["todo"], ({ todo }) => ({
  todo,
}));

const EnhancedTodoItem = enhanced(TodoItem);
