import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PressableProps } from "react-native/Libraries/Components/Pressable/Pressable";
import { styled, Text, View, YGroup } from "tamagui";

const StyledSafeAreaView = styled(SafeAreaView);

export default function Index() {
	const titles = ["Home", "Work", "Groceries", "Chores", "Other"];

	return (
		<StyledSafeAreaView padding={10}>
			<YGroup>
				{titles.map((title) => (
					<YGroup.Item key={title}>
						<TodoItem title={title} />
					</YGroup.Item>
				))}
			</YGroup>
		</StyledSafeAreaView>
	);
}

const TodoItem = ({ title, ...props }: { title?: string } & PressableProps) => {
	return (
		<Pressable {...props}>
			<View
				backgroundColor="$backgroundHover"
				borderRadius="$4"
				padding="$4"
				marginBottom="$2"
			>
				<Text>{title}</Text>
			</View>
		</Pressable>
	);
};
