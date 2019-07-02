import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native'
import { Button, Image } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

import Api from '../../utils/api';

export default class Index extends Component {

  static navigationOptions = {
    header: null
  }

  signIn = async () => {
    try {
      const token = await Api.postLogin();
      await AsyncStorage.setItem('@userToken', token)
      this.props.navigation.navigate('AuthLoading')
    } 
    catch (error) {
      console.log(error)
    }
  }

  render(){
    return(
      <View style = {styles.container}>
        <Image
          source={require('../img/principal.png')}
          style={styles.logo}
        />
        <Button
          title="Entrar"
          titleStyle={styles.buttonText}
          buttonStyle={styles.buttonContainer}
          onPress = {this.signIn}
        />           
      </View>   
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'space-evenly',
    backgroundColor: '#E67E22',
  },
  logo:{
    width: 300, 
    height: 150,
    resizeMode:'contain'
  },
  buttonContainer: {
    height: 40,
    width: '30%',
    backgroundColor: 'white'
  },
  buttonText:{
    flex:1,
    color:'#E67E22', 
    alignItems:'center'
  }  
});