import React, {Component} from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'


class AuthLoading extends Component {

  componentDidMount = async () => {
    await this.loadApp()
  }

  loadApp = async () => {
    try {
      const value = await AsyncStorage.getItem('@userToken')
      if(value !== null) {
        this.props.navigation.navigate('AppStack')
      }
      else{
        this.props.navigation.navigate('AuthStack')
      }
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }
}

export default AuthLoading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E67E22',
    alignItems: 'center',
    justifyContent: 'center',
  },
})