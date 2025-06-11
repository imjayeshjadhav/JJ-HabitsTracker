import {Account, Client, Databases} from 'react-native-appwrite'

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)

export const account= new Account(client)