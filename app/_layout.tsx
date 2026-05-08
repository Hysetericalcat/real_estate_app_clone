import { Stack } from "expo-router";
import './global.css'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from "react";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
    'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
    'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a1a' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(root)" />
      </Stack>
    </>
  );
}
