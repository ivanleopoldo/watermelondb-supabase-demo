import Ionicons from "@expo/vector-icons/Ionicons";
import { defaultConfig } from "@tamagui/config/v5";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import { createTamagui, styled, TamaguiProvider, View } from "tamagui";

const config = createTamagui(defaultConfig);

const Icon = styled(Ionicons);

export default function RootLayout() {
	return (
		<TamaguiProvider defaultTheme={"light"} config={config}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: "Home",
						headerRight: () => (
							<Pressable onPress={() => router.push("/settings")}>
								<View marginLeft={5.5}>
									<Icon name="settings-sharp" size={24} color="black" />
								</View>
							</Pressable>
						),
					}}
				/>
				<Stack.Screen
					name="settings"
					options={{ title: "Settings", presentation: "modal" }}
				/>
			</Stack>
		</TamaguiProvider>
	);
}
