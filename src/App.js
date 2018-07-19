// @flow
import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import Icon from './components/Icon';
import Avatar from './components/Avatar';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SinglePostScreen from './screens/SinglePostScreen';
import NewPostScreen from './screens/NewPostScreen';

import { StreamApp } from './Context';

const NotificationsStack = createStackNavigator({
  Notifications: { screen: NotificationsScreen },
});

// $FlowFixMe
const ProfileStack = createStackNavigator({
  Profile: { screen: ProfileScreen },
});

const SearchStack = createStackNavigator({
  Search: { screen: SearchScreen },
});

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Notifications: NotificationsStack,
    Profile: ProfileStack,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return <Icon name="home" />;
        } else if (routeName === 'Search') {
          return <Icon name="search" />;
        } else if (routeName === 'Notifications') {
          return <Icon name="notifications" />;
        } else if (routeName === 'Profile') {
          return (
            // TODO: Link this to the current user
            <Avatar
              source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
              size={25}
              noShadow
            />
          );
        }
      },
    }),
    initialRouteName: 'Home',
  },
);

const doNotShowHeaderOption = {
  navigationOptions: {
    header: null,
  },
};

const Navigation = createStackNavigator({
  Tabs: { screen: TabNavigator, ...doNotShowHeaderOption },
  SinglePost: { screen: SinglePostScreen },
  NewPost: { screen: NewPostScreen },
  EditProfile: { screen: EditProfileScreen },
});

const App = () => (
  <StreamApp
    apiKey={process.env['STREAM_API_KEY'] || ''}
    appId={process.env['STREAM_APP_ID'] || ''}
    userId="batman"
    token={process.env['STREAM_TOKEN'] || ''}
    options={{
      urlOverride: {
        api: process.env['STREAM_API_URL'],
      },
    }}
  >
    <Navigation />
  </StreamApp>
);

export default App;
