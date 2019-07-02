import React, {Component} from 'react'
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import AuthLoading from './src/screens/AuthLoading'
import Home from './src/screens/Home'
import Index from './src/screens/Index'
import Results from './src/screens/Results'

const AuthStack = createStackNavigator({ Index });
const AppStack = createStackNavigator({ Home, Results },{initialRouteName: 'Home'});

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading,
    AppStack,
    AuthStack,
  },
  {
    initialRouteName: 'AuthStack'
  }
)

const AppContainer = createAppContainer(RootNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

