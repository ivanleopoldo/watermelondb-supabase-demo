import { Redirect } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { Button, Input, Text, View, YStack } from "tamagui";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { isSignedIn, signIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  const handleSignIn = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      signIn(data);
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      signIn(data);
    }
    setIsLoading(false);
  };

  return (
    <View flex={1} alignItems="center" justifyContent="center" padding={20}>
      <YStack justifyContent="center" alignItems="center" width="100%">
        <Text fontSize={40} fontWeight={"600"}>
          Welcome to my app
        </Text>
        <Text fontSize={20} fontWeight={"unset"} color={"dimgray"}>
          {isSignUp
            ? "Please sign up to continue"
            : "Please sign in to continue"}
        </Text>
      </YStack>
      <YStack gap={10} marginTop={20} width="100%">
        <Text>Email</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text>Password</Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        <Text onPress={() => setIsSignUp((prev) => !prev)} textAlign="center">
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Text>
        <View marginTop={10}>
          <Button
            padding={10}
            borderRadius={5}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={isLoading}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </View>
      </YStack>
    </View>
  );
}
