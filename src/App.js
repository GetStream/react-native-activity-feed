import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Icon from "./components/Icon";
import Avatar from './components/Avatar';
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from './screens/EditProfileScreen';


const App = createBottomTabNavigator(
  {
    Home: createStackNavigator({
      Home: {
        screen: HomeScreen,
      }
    }),
    Search: createStackNavigator({
      Search: {
        screen: SearchScreen,
      }
    }),
    Notifications: createStackNavigator({
      Notifications: {
        screen: NotificationsScreen,
      },
    }, {
      initialRouteName: 'Notifications'
    }),
    Profile: createStackNavigator(
      {
        Profile: {
          screen: ProfileScreen,
          navigationOptions: ({ navigator }) => ({
            headerTransparent: true,
            headerBackTitle: null
          })
        },
        EditProfile: {
          screen: EditProfileScreen,
        }
      },
      {
        // headerMode: "none",
        initialRouteName: "Profile"
      }
    )
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          return <Icon name="home" />;
        } else if(routeName === "Search") {
          return <Icon name="search" />;
        } else if (routeName === "Notifications") {
          return <Icon name="notifications" />;
        } else if (routeName === "Profile") {
          return (
            <Avatar
              source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
              size={25} noShadow
            />
          );
        }
      }
    }),
    initialRouteName: 'Search'
  },

);


export default App;
