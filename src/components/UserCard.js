// @flow
import React from 'react';
import { View, Text } from 'react-native';
import Avatar from './Avatar';
import FollowButton from './FollowButton';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike, UserData } from '../types';

export type Props = {
  user: UserData,
  styles?: StyleSheetLike,
  avatarPlaceholder?: string
};

export default class UserCard extends React.Component<Props> {
  static defaultProps = {};
  render() {
    const styles = buildStylesheet('userCard', this.props.styles);
    const { user, avatarPlaceholder } = this.props;
    return (
      <View style={styles.container}>
        <Avatar source={user.profileImage} size={42} noShadow
            avatarPlaceholder={avatarPlaceholder} />
        <Text style={styles.text}>{user.name}</Text>

        <FollowButton />
      </View>
    );
  }
}
