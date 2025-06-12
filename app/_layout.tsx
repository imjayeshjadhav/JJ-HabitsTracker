import { Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";

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
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
