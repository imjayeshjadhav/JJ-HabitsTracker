import { DATABASE_ID, databases, HABITS_COLLECTION_ID, HABITS_COMPLETIONS_COLLECTION_ID } from '@/lib/appwrite'
import { useAuth } from '@/lib/auth-context'
import { Habit, HabitCompletion } from '@/types/database.type'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Query } from 'react-native-appwrite'
import { ScrollView } from 'react-native-gesture-handler'
import { Card, Text } from 'react-native-paper'

const StreaksScreen = () => {

  const {user} = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedHabit, setCompletedHabit] = useState<HabitCompletion[]>([])

  useEffect(()=>{
  
      if (user){
        fetchHabits();
        fetchCompletions()
      }
    },[user])

    const fetchHabits = async () =>{
      try {
        const response = await databases.listDocuments(
          DATABASE_ID, 
          HABITS_COLLECTION_ID,
          [Query.equal("user_id", user?.$id ?? "")]
        )
        setHabits(response.documents as Habit[])
      } catch (error) {
        console.log(error)
      }
    }
  
    const fetchCompletions = async () =>{
      try {
        const response = await databases.listDocuments(
          DATABASE_ID, 
          HABITS_COMPLETIONS_COLLECTION_ID,
          [
            Query.equal("user_id", user?.$id ?? ""),
          ]
        );
  
        const completions= response.documents as HabitCompletion[]
        setCompletedHabit(completions)
      } catch (error) {
        console.log(error)
      }
    }

    interface StreakData {
      streak :number;
      bestStreak :number,
      total: number;
    }

    const getStreakData = (habitId:string)=>{
      const habitCompletions = completedHabit?.filter(
        (c)=> c.habit_id === habitId
        ).sort((a,b) => 
          new Date(a.completed_at).getTime()-
          new Date(b.completed_at).getTime()
      )

      if (habitCompletions?.length === 0){
        return{streak:0, bestStreak:0, total:0}
      }

      // build streak data
      let streak = 0;
      let bestStreak = 0;
      let total = habitCompletions.length;

      let lastDate: Date | null = null;
      let currentStreak = 0;

      habitCompletions?.forEach((c) =>{
        const date = new Date(c.completed_at)
        if (lastDate){
          const diff = (date.getTime()- lastDate.getTime()) / (1000*60*60*24);

          if (diff <= 1.5){
            currentStreak +=1;
          } else {
            currentStreak = 1;
          }
        } else {
          if (currentStreak > bestStreak) bestStreak = currentStreak
          streak= currentStreak
          lastDate = date
        }
      })
      
      return{streak, bestStreak, total}
    }

    const habitStreaks = habits.map((habit) =>{
      const {streak, bestStreak, total} = getStreakData(habit.$id)
      return {habit, bestStreak, streak, total}
    })

    const rankedHabits = habitStreaks.sort((a,b) => a.bestStreak - b.bestStreak)

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='headlineSmall'>
        {" "}
        Habit Streaks
      </Text>
      {
        habits.length === 0 ? 
        (
          <View>
            <Text>No habits yet. Add your first Habit</Text>
          </View>
        ) :
        (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {rankedHabits.map(({ habit, streak, bestStreak, total }, key) => (
            <Card
              key={key}
              style={[styles.card, key === 0 && styles.firstCard]}
            >
              <Card.Content>
                <Text variant="titleMedium" style={styles.habitTitle}>
                  {" "}
                  {habit.title}
                </Text>
                <Text style={styles.habitDescription}>
                  {" "}
                  {habit.description}
                </Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statBadgeText}> 🔥 {streak}</Text>
                    <Text style={styles.statLabel}> Current</Text>
                  </View>
                  <View style={styles.statBadgeGold}>
                    <Text style={styles.statBadgeText}> 🏆 {bestStreak}</Text>
                    <Text style={styles.statLabel}> Best</Text>
                  </View>
                  <View style={styles.statBadgeGreen}>
                    <Text style={styles.statBadgeText}> ✅ {total}</Text>
                    <Text style={styles.statLabel}> Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
        )
      }
    </View>
  )
}

export default StreaksScreen

const styles = StyleSheet.create({
  container :{
    flex:1,
    backgroundColor :"#f5f5f5",
    padding :16,

  },
  title :{
    fontWeight :"bold",
    marginBottom:16,
  },
  card :{
    marginBottom :18,
    borderRadius :18,
    backgroundColor :"#fff",
    elevation :3,
    shadowColor :"#000",
    shadowOffset :{width :0, height :2},
    shadowOpacity :0.08,
    shadowRadius :8,
    borderWidth :1,
    borderColor:"#f0f0f0"
  },
  firstCard :{
    borderWidth :2,
    borderColor :"#7c4dff"
  },
  habitTitle :{
    fontWeight :"bold",
    fontSize :18,
    marginBottom :2,
  },
  habitDescription :{
    color :"#6c6c80",
    marginBottom :8,
  },
  statsRow :{
    flexDirection : "row",
    justifyContent :"space-between",
    marginBottom :12,
    marginTop :8,
  },
  statBadge :{
    backgroundColor :"#fff3e0",
    borderRadius :10,
    paddingHorizontal :12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:16,
  },
  statBadgeGold :{
    backgroundColor :"#fffde7",
    borderRadius :10,
    paddingHorizontal :12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:16,
  },
  statBadgeGreen :{
    backgroundColor :"#e8f5e9",
    borderRadius :10,
    paddingHorizontal :12,
    paddingVertical:6,
    alignItems:"center",
    minWidth:16,
  },
  statBadgeText :{
    fontWeight :"bold",
    fontSize:15,
    color :"#22223b",
  },
  statLabel :{
    fontWeight :"500",
    fontSize:11,
    color :"#888",
    marginTop:2,
  },

})