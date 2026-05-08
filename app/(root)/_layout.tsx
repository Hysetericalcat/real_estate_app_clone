import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="listing/index" />
            <Stack.Screen name="listing/[id]" />
            <Stack.Screen name="crm/index" />
            <Stack.Screen name="crm/[id]" />
        </Stack>
    );
}