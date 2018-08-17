// @flow
import React from 'react';
import { View } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import Icon from './components/Icon';
import IconBadge from './components/IconBadge';
import { Avatar, StreamApp, Button } from 'react-native-activity-feed';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SinglePostScreen from './screens/SinglePostScreen';
import StatusUpdateScreen from './screens/StatusUpdateScreen';
import {
  StreamContext,
  FlatFeed,
  BaseActivity,
} from 'react-native-activity-feed';

// $FlowFixMe
const NotificationsStack = createStackNavigator({
  Notifications: { screen: NotificationsScreen },
});

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
          return (
            <StreamContext.Consumer>
              {(appCtx) => (
                <IconBadge
                  {...appCtx}
                  showNumber
                  mainElement={<Icon name="notifications" />}
                />
              )}
            </StreamContext.Consumer>
          );
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
  Tabs: {
    screen: TabNavigator,
    ...doNotShowHeaderOption,
  },
  SinglePost: { screen: SinglePostScreen },
  NewPost: { screen: StatusUpdateScreen },
  EditProfile: { screen: EditProfileScreen },
});

const App = () => {
  let apiKey = process.env['STREAM_API_KEY'];
  let appId = process.env['STREAM_APP_ID'];
  let token = process.env['STREAM_TOKEN'];

  if (!apiKey) {
    console.error('STREAM_API_KEY should be set');
    return null;
  }

  if (!appId) {
    console.error('STREAM_APP_ID should be set');
    return null;
  }

  if (!token) {
    console.error('STREAM_TOKEN should be set');
    return null;
  }

  function example() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
        <Navigation />
      </StreamApp>
    );
  }

  function stepOne() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      />
    );
  }

  function stepTwo() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
        <FlatFeed />
      </StreamApp>
    );
  }

  function stepThree() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
        <FlatFeed
          renderActivity={(props) => {
            return (
              <BaseActivity
                {...props}
                Footer={
                  <View style={{ paddingLeft: 15 }}>
                    <Button
                      count={props.activity.reaction_counts.heart}
                      on={
                        props.activity.own_reactions.heart &&
                        Boolean(props.activity.own_reactions.heart.length)
                      }
                      onPress={() =>
                        props.onToggleReaction('heart', props.activity)
                      }
                      icon={{
                        //$FlowFixMe
                        on: require('../example/images/icons/heart.png'),
                        //$FlowFixMe
                        off: require('../example/images/icons/heart-outline.png'),
                      }}
                      label={{
                        single: 'like',
                        plural: 'likes',
                      }}
                    />
                  </View>
                }
              />
            );
          }}
        />
      </StreamApp>
    );
  }

  return (
    <React.Fragment>
      {example()}

      {stepOne()}
      {stepTwo()}
      {stepThree()}
    </React.Fragment>
  );
};

export default App;
