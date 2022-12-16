import React from 'react';
import { StatusBar } from 'react-native'; 
import { ThemeProvider} from 'styled-components';
import AppLoading from 'expo-app-loading';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';

import { Signin } from './src/screens/Signin';

import { AuthProvider, useAuth } from './src/hooks/auth';


import 'intl';
import 'intl/locale-data/jsonp/pt-BR';



export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if(!fontsLoaded || userStorageLoading){   //segurar a tela de splash tela que aparece enquanto esta sendo carregado
    return <AppLoading />
  }
  
  return ( 
  
  <GestureHandlerRootView style ={{flex:1}}>
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content"/>
          <AuthProvider>
            <Routes /> 
          </AuthProvider>                    
      
    </ThemeProvider>   
  </GestureHandlerRootView>
  
  )
}


