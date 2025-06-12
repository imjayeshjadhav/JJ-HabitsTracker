import { useAuth } from "@/lib/auth-context";
import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {

  const {signOut} = useAuth()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Button mode="text" onPress={signOut} icon="logout">SignOut</Button>
    </View>
  );
}
