import { Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {user, isLoading} = useAuth();
  const segments = useSegments()

  useEffect(() => {

      const inAuthGroup = segments[0] === "auth"

      if (!user && !inAuthGroup && !isLoading){
        router.replace("/auth")
      }
      else if(user && inAuthGroup && !isLoading) {
        router.replace("/")
      }
  },[user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
          </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
