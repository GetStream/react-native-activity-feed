// @flow
import React from 'react';
import { StatusBar, Image, TouchableOpacity } from 'react-native';

import Avatar from '../../components/Avatar';

import FlatFeed from '../../components/FlatFeed';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import PostIcon from '../../images/icons/post.png';

import type { NavigationProps } from '../../types';
import type { NavigationEventSubscription } from 'react-navigation';
type Props = NavigationProps;

class HomeScreen extends React.Component<Props> {
  _navListener: NavigationEventSubscription;
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'HOME',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{ paddingLeft: 15 }}
      >
        <Avatar
          source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
          size={23}
          noShadow
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('NewPost')}
        style={{ paddingRight: 15 }}
      >
        <Image source={PostIcon} style={{ width: 23, height: 23 }} />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return <FlatFeed feedGroup="timeline" navigation={this.props.navigation} />;
  }
}

export default HomeScreen;
