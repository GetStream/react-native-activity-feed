import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Icon from "./components/Icon";
import Avatar from './components/Avatar';
import ProfileScreen from './screens/ProfileScreen';


class HomeScreen extends React.Component {
  com
  render() {
    StatusBar.setBarStyle('dark-content', true);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home !</Text>
      </View>
    );
  }
}

class SearchScreen extends React.Component {
  com;
  render() {
    StatusBar.setBarStyle("dark-content", true);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Search !</Text>
      </View>
    );
  }
}

class NotificationsScreen extends React.Component {
  com;
  render() {
    StatusBar.setBarStyle("dark-content", true);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Notifications !</Text>
      </View>
    );
  }
}

const App = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Search: SearchScreen,
    Notifications: NotificationsScreen,
    Profile: createStackNavigator(
      {
        Profile: {
          screen: ProfileScreen,
          navigationOptions: ({ navigator }) => ({
            headerTransparent: true,
            headerBackTitle: null
          })
        }
      },
      {
        headerMode: "none",
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
              size={25}
            />
          );
        }
      }
    })
  }
);


export default App;
