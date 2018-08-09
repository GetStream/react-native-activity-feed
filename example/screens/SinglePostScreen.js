// @flow
import React from 'react';
import { View } from 'react-native';

import BackButton from '../components/BackButton';
import SinglePost from '../components/SinglePost';

import type { NavigationProps } from '../types';

type Props = NavigationProps;

export default class SinglePostScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'POST DETAIL',
    headerLeft: (
      <View style={{ paddingLeft: 15 }}>
        <BackButton pressed={() => navigation.goBack()} color="blue" />
      </View>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  render() {
    const { navigation } = this.props;
    const activity = navigation.getParam('activity');
    const feedGroup = navigation.getParam('feedGroup');
    const userId = navigation.getParam('userId');
    return (
      <SinglePost
        activity={activity}
        feedGroup={feedGroup}
        userId={userId}
        navigation={this.props.navigation}
      />
    );
  }
}
