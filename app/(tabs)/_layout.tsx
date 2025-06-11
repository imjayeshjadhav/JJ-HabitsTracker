import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import  {AntDesign, FontAwesome5} from '@expo/vector-icons'
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor :"coral"}}>
        <Tabs.Screen name='index' 
          options={{
            title:"Home", 
            tabBarIcon : ({color, focused}) => { return focused ? ( <FontAwesome5 name="home" size={24} color="black" /> ): (<AntDesign name='home' size={24} color="black" />)  } }}  />
        <Tabs.Screen name='login' options={{title:"Login"}} />
    </Tabs>
  )
}