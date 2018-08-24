import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, FollowButton } from 'expo-activity-feed';
import { buildStylesheet } from '../styles';

export default class UserCard extends React.Component {
  static defaultProps = {};
  render() {
    let styles = buildStylesheet('userCard', this.props.styles);
    let { user } = this.props;
    return (
      <View style={styles.container}>
        <Avatar source={user.user_image} size={42} noShadow />
        <Text style={styles.text}>{user.name}</Text>
        <FollowButton />
      </View>
    );
  }
}
