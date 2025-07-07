import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";

export default function Index() {

  const {signOut, user} = useAuth()

  const [habits, setHabits] = useState<Habit[]>()

  useEffect(()=>{
    fetchHabits()
  },[user])

  const fetchHabits = async () =>{
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      )
      console.log(response.documents)
      setHabits(response.documents as Habit[])
    } catch (error) {
      
    }
  }

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
