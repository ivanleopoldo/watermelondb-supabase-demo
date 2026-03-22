import { Button, Text, View } from "tamagui";
import { useAuth } from "../hooks/useAuth";
import { database } from "../lib/db";

export default function Settings() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Settings</Text>
      <Button
        onPress={async () => {
          signOut();
          await database.write(() => database.unsafeResetDatabase());
        }}
      >
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
