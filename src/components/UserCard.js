//
import React from 'react';
import { View, Text } from 'react-native';
import Avatar from './Avatar';
import FollowButton from './FollowButton';
import { buildStylesheet } from '../styles';

export default class UserCard extends React.Component {
  static defaultProps = {};
  render() {
    const styles = buildStylesheet('userCard', this.props.styles);
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <Avatar source={user.profileImage} size={42} noShadow />
        <Text style={styles.text}>{user.name}</Text>

        <FollowButton />
      </View>
    );
  }
}
