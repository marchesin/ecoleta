import React from 'react';
import { AppLoading } from 'expo';
import { StatusBar } from 'react-native';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Routes from "./src/routes";

export default function App() {
  const [fontsLoad] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular, 
    Roboto_500Medium
  });

  if(!fontsLoad){
    return <AppLoading></AppLoading>
  }/**/

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent></StatusBar>
      <Routes />
    </>
  );
}