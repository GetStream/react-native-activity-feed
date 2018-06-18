import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import ProfileScreen from './screens/ProfileScreen';

const Tabs = createBottomTabNavigator({
  Tab1: { screen: 'Profile'}
})

const App = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({navigator}) => ({
        headerTransparent: true,
        headerBackTitle: null,
      })
    }
  },
  {
    headerMode: 'none',
    initialRouteName: "Profile",
  }
);




export default App;
