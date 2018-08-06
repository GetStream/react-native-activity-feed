// @flow

import React from 'react';
import { View, StatusBar } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import Button from '../components/Button';
import type { NavigationProps } from '../types';
import type { NavigationEventSubscription } from 'react-navigation';

type Props = NavigationProps;

export default class ProfileScreen extends React.Component<Props> {
  _navListener: NavigationEventSubscription;
  static navigationOptions = ({ navigation }: Props) => ({
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      paddingLeft: 10,
      paddingRight: 10,
    },
    headerRight: (
      <Button pressed={() => navigation.navigate('EditProfile')}>
        Edit Profile
      </Button>
    ),
    headerTransparent: true,
    headerBackTitle: null,
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  render() {
    return (
      <View>
        <ProfileHeader />
      </View>
    );
  }
}
