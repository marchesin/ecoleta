import React, { useState, useEffect } from 'react';
import {Feather as Icon} from '@expo/vector-icons';
import { View, StyleSheet, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from 'axios';

interface IbgeUf{
  nome:string;
  sigla:string;
}

interface IbgeCities{
  nome:string;
}


const Home = () => {

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const [ufs, setUfs] = useState<IbgeUf[]>([]);
  const [cities, setCities] = useState<IbgeCities[]>([]);

  const navigation = useNavigation();

  function handleNavigateToPoints(){
    navigation.navigate('Points', {uf, city});
  }

  // PEGA AS UNIDADES FEDERATIVAS (UF)
  useEffect(()=>{
    axios
      .get<IbgeUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data);
    });
  },[]);
  
  // PEGA O MUNICIPIOS COM BASE NO ID DA UNIDADE FEDERATIVA
  useEffect(()=>{
    axios
      .get<IbgeCities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(response => {
        setCities(response.data);
      }
    );
  },[uf]);
  
  return(
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}></Image>
          <View>
            <Text style={styles.title}>TesteSeu marketplace de coleta de resíduo</Text>
            <Text style={styles.description}>Ajudamos pessoa a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        <View>
          <RNPickerSelect
            style={{
              ...pickerSelectStyles
            }}
            placeholder={{label: 'selecione uma cidade.'}}
            onValueChange={(value) => setUf(value)}
            items={ufs.map(uf => ({label: `${uf.nome} (${uf.sigla})`, value: uf.sigla}))}
          />
          
          {/*<TextInput 
            style={styles.input}
            placeholder="Digite um estado"
            value={uf}
            onChangeText={setUf}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={2}
          ></TextInput>
          */}
          <RNPickerSelect
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 5,
                right: 15,
              }
            }}
            onValueChange={(value) => setCity(value)}
            items={cities.map(city => ({label: city.nome, value: city.nome}))}
            placeholder={{label: 'selecione uma cidade.'}}
          />
          {/*<TextInput 
            style={styles.input}
            placeholder="Digite uma cidade"
            value={city}
            autoCorrect={false}
            onChangeText={setCity}
          ></TextInput>*/}

          <RectButton style={styles.button} onPress={handleNavigateToPoints} >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      paddingBottom: 30,
      fontSize: 60,
      //paddingHorizontal: 10,
      //paddingVertical: 16,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    }/*,
    iconContainer: {
      top: 20,
      right: 12,
    },/**/
  });
