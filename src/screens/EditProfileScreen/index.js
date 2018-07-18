// @flow
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { EditProfileForm } from '~/components/EditProfileForm';
import { StreamContext } from '~/Context';
import BackButton from '~/components/BackButton';
import type { NavigationProps } from '~/types';
import type { NavigationEventSubscription } from 'react-navigation';

type Props = NavigationProps;

export default class EditProfileScreen extends React.Component<Props> {
  _navListener: NavigationEventSubscription;

  static navigationOptions = ({ navigation }: Props) => ({
    title: 'EDIT PROFILE',
    headerRight: <Text>Save</Text>,
    headerLeft: <BackButton pressed={() => navigation.goBack()} color="blue" />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return (
      <StreamContext.Consumer>
        {({ user }) => {
          return <EditProfileForm user={user} />;
        }}
      </StreamContext.Consumer>
    );
  }
}
