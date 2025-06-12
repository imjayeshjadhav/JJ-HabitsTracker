import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {Button, Text, TextInput, useTheme} from 'react-native-paper'

export default function AuthScreen () {

    const [isSignedUp, setIsSignedUp] = useState<boolean>(false)
    const [email, setEmail] = useState<string> ("")
    const [password, setPassword] = useState<string> ("")
    const [error, setError] = useState<string | null>("")

    const theme = useTheme()
    const router = useRouter()

    const {signIn, signUp} = useAuth()

    const handleAuth = async () =>{
        if (!email || !password){
            setError("Please fill in all fields")
            return;
        }

        if (password.length <6 ){
            setError("Password must me at least 6 letters")
            return
        }

        setError(null)

        if (isSignedUp){
           const error =  await signUp(email,password)
           if (error){
                setError(error)
                return
           }
        }
        else{
            const error = await signIn(email,password)
            if (error){
                    setError(error)
                    return
            }

            router.replace("/")
        }
    }

    const handleSwitchMode = () =>{
        setIsSignedUp((prev)=> !prev)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}  
            style={styles.container}  
        >
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>{isSignedUp ?"Create Account" : "Welcome Back"}</Text>
                <TextInput 
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="example@gmail.com"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                />
                <TextInput 
                    label="Password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                />

                {error  && 
                    <Text style={{color:theme.colors.error}}>{error}</Text>
                }

                <Button mode="contained" style={styles.button} onPress={handleAuth}>
                    {isSignedUp ?"Sign Up" :"Sign In"}
                </Button>
                <Button style={styles.switchButton} mode="text" onPress={handleSwitchMode}>
                    {isSignedUp?"Already have an account? Sign In": "Don't have an account? Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor :"#f5f5f5",
    },
    content:{
        flex:1,
        padding:16,
        justifyContent:"center"
    },
    title:{
        textAlign:"center",
        marginBottom:24,
    },
    input:{
        marginBottom:16,
    },
    button:{
        marginTop:8
    },
    switchButton:{
        marginTop:16,
    }
})