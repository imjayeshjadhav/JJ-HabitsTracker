import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Button, SegmentedButtons, TextInput,Text, useTheme } from 'react-native-paper'
import { useAuth } from '@/lib/auth-context'
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite'
import { ID } from 'react-native-appwrite'
import { useRouter } from 'expo-router'

const FREQUENCIES = ["daily","weekly","monthly"]
type Frequency = (typeof FREQUENCIES)[number]

export default function AddHabitScreen() {

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [frequency, setFrequency]   = useState<string>("")
    const [error, setError]   = useState<string>("")
    const {user} = useAuth()
    const router = useRouter()
    const theme = useTheme()

    const handleSubmit = async () =>{
        if (!user) return;

        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(),
            {
                user_id:user.$id,
                title,
                description,
                frequency,
                streak_count:0,
                last_completed: new Date().toISOString(),
                created_at: new Date().toISOString()
            }
        );
        router.back()
        } catch (error) {
            if(error instanceof Error){
                setError(error.message)
                return;
            }
            setError("There was an error creating the habit")
        }

    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new goal</Text>
      <TextInput
        label="Title"
        mode='outlined'
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode='outlined'
        style={styles.input}
        onChangeText={setDescription}
      />
      <View style={styles.frequencyContainer
}>
        <SegmentedButtons 
            value={frequency}
            buttons={FREQUENCIES.map((freq)=>({
                value:freq,
                label:freq.charAt(0).toUpperCase() + freq.slice(1)
            }))}
            onValueChange={(val)=> setFrequency(val as Frequency)}
        />
      </View>
      <Button onPress={handleSubmit} mode='contained' disabled={!title || !description}>
            Add Habit
      </Button>
      {
        error  && 
        <Text style={{color:theme.colors.error}}>{error}</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:16,
        backgroundColor :"#f5f5f5",
    },

    input:{
        marginBottom:16,
    },

    frequencyContainer:{
        marginBottom:24,
    },
    title :{
      fontWeight:"bold",
      fontSize:24,
      marginBottom :12,
    }
})